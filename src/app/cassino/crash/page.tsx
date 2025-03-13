'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { calculateMultiplier } from '@/lib/crash';
import toast from 'react-hot-toast';

// Componentes
import Header from './components/Header';
import Footer from './components/Footer';
import CrashGraph from './components/CrashGraph';
import BetPanel from './components/BetPanel';
import BetList from './components/BetList';
import UserBetHistory from './components/UserBetHistory';
import LoadingScreen from './components/LoadingScreen';
import ErrorMessage from './components/ErrorMessage';

// Tipos
import { User, CrashBet, CrashGame, UserBet } from './components/types';

export default function CrashGamePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<CrashGame | null>(null);
  const [bets, setBets] = useState<CrashBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [userBet, setUserBet] = useState<CrashBet | null>(null);
  const [placingBet, setPlacingBet] = useState(false);
  const [cashingOut, setCashingOut] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userBetHistory, setUserBetHistory] = useState<UserBet[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include'
        });
        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        setError('Erro ao carregar dados do usuário');
      }
    };

    fetchUserData();
  }, [router]);

  // Buscar dados do jogo atual
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch('/api/crash/game');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do jogo');
        }

        const data = await response.json();
        console.log('Dados do jogo atualizados:', data.game.status);
        console.log('CrashPoint do jogo:', data.game.crashPoint);

        // Se o jogo mudou, resetar o estado de contagem
        if (game?.id !== data.game.id) {
          if (countdownInterval) {
            clearInterval(countdownInterval);
            setCountdownInterval(null);
          }
        }

        setGame(data.game);
        setBets(data.bets);

        // Verificar se o usuário já tem uma aposta neste jogo
        if (user) {
          const userBet = data.bets.find((bet: CrashBet) => bet.userId === user.id);
          setUserBet(userBet || null);
        }

        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar jogo:', err);
        setError('Erro ao carregar dados do jogo');
        setLoading(false);
      }
    };

    if (user) {
      fetchGameData();

      // Atualizar os dados do jogo a cada 5 segundos
      const interval = setInterval(fetchGameData, 5000);
      return () => clearInterval(interval);
    }
  }, [user, game?.id]);

  // Iniciar o jogo quando o status mudar para RUNNING
  useEffect(() => {
    if (!game) return;

    // Quando o jogo estiver em estado PENDING, iniciar a contagem regressiva
    if (game.status === 'PENDING') {
      console.log('Jogo em estado PENDING, iniciando contagem regressiva');

      // Limpar qualquer intervalo existente
      if (countdownInterval) {
        clearInterval(countdownInterval);
        setCountdownInterval(null);
      }

      // Definir a contagem regressiva inicial
      setCountdown(10);

      // Iniciar a contagem regressiva
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null) return null;
          const newValue = prev - 1;
          console.log('Contagem regressiva:', newValue);

          // Quando a contagem chegar a zero, atualizar o status do jogo para RUNNING
          if (newValue <= 0) {
            console.log('Contagem regressiva chegou a zero, iniciando jogo');
            clearInterval(interval);
            setCountdownInterval(null);

            // Verificar se o jogo ainda está em estado PENDING antes de tentar atualizá-lo
            if (game.status === 'PENDING') {
              console.log('Enviando requisição para iniciar jogo:', game.id);
              // Atualizar o status do jogo para RUNNING
              startGame();
            } else {
              console.log('Jogo não está mais em estado PENDING, ignorando atualização');
            }

            return 0;
          }
          return newValue;
        });
      }, 1000);

      // Limpar o intervalo quando o componente for desmontado
      return () => {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
      };
    }

    // Quando o jogo estiver em estado RUNNING, iniciar a animação
    if (game.status === 'RUNNING') {
      console.log('Jogo em estado RUNNING, iniciando animação');

      // Definir o tempo de início do jogo se ainda não estiver definido
      if (!gameStartTime) {
        console.log('Definindo tempo de início do jogo');
        setGameStartTime(Date.now());
      }
    }

    // Quando o jogo estiver em estado CRASHED, parar a animação
    if (game.status === 'CRASHED') {
      console.log('Jogo em estado CRASHED, parando animação');

      // Limpar o frame de animação
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Resetar o tempo de início do jogo
      setGameStartTime(null);
    }
  }, [game?.status, game?.id, gameStartTime]);

  // Buscar histórico de apostas do usuário
  useEffect(() => {
    const fetchUserBetHistory = async () => {
      if (!user) return;

      setLoadingHistory(true);
      try {
        const response = await fetch('/api/crash/user-bets');
        if (!response.ok) {
          throw new Error('Erro ao buscar histórico de apostas');
        }

        const data = await response.json();
        setUserBetHistory(data.bets);
      } catch (err) {
        console.error('Erro ao buscar histórico de apostas:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchUserBetHistory();
  }, [user, game]);

  // Função para fazer uma aposta
  const handlePlaceBet = async (amount: number, autoWithdrawAt: number | null) => {
    if (!user || !game || amount <= 0) return;

    setPlacingBet(true);

    try {
      const response = await fetch('/api/crash/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
          amount: amount,
          autoWithdrawAt: autoWithdrawAt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro ao fazer aposta:', data.error);
        setError(data.error || 'Erro ao fazer aposta');
        setPlacingBet(false);
        return;
      }

      // Atualizar o saldo do usuário
      setUser({
        ...user,
        balance: user.balance - amount,
      });

      // Atualizar a aposta do usuário
      setUserBet(data.bet);

      // Atualizar a lista de apostas
      setBets([...bets, data.bet]);
    } catch (err) {
      console.error('Erro ao fazer aposta:', err);
      // Não definir erro aqui para evitar recarregar a página
      // Apenas registrar no console
    } finally {
      setPlacingBet(false);
    }
  };

  // Função para sacar (cashout)
  const handleCashout = useCallback(async () => {
    if (!user || !game || !userBet) return;

    setCashingOut(true);

    try {
      const response = await fetch('/api/crash/bet', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          betId: userBet.id,
          multiplier: currentMultiplier,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro ao fazer cashout:', data.error);
        setError(data.error || 'Erro ao fazer cashout');
        setCashingOut(false);
        return;
      }

      // Atualizar o saldo do usuário
      setUser({
        ...user,
        balance: user.balance + (userBet.amount * currentMultiplier),
      });

      // Atualizar a aposta do usuário
      setUserBet({
        ...userBet,
        status: 'CASHED_OUT',
        cashoutMultiplier: currentMultiplier,
        profit: userBet.amount * currentMultiplier - userBet.amount,
      });

      // Atualizar a lista de apostas
      setBets(bets.map(bet =>
        bet.id === userBet.id
          ? {
            ...bet,
            status: 'CASHED_OUT',
            cashoutMultiplier: currentMultiplier,
            profit: bet.amount * currentMultiplier - bet.amount,
          }
          : bet
      ));
    } catch (err) {
      console.error('Erro ao fazer cashout:', err);
      // Não definir erro aqui para evitar recarregar a página
      // Apenas registrar no console
    } finally {
      setCashingOut(false);
    }
  }, [user, game, userBet, currentMultiplier, bets]);

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  // Função para lidar com o crash do jogo
  const handleCrash = () => {
    // Resetar o tempo de início do jogo
    setGameStartTime(null);
  };

  // Função para adicionar saldo
  const handleAddBalance = async (amount: number) => {
    if (!user) return;

    try {
      const response = await fetch('/api/users/add-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro ao adicionar saldo:', data.error);
        setError(data.error || 'Erro ao adicionar saldo');
        return;
      }

      // Atualizar o saldo do usuário
      setUser({
        ...user,
        balance: data.user.balance,
      });
    } catch (err) {
      console.error('Erro ao adicionar saldo:', err);
      // Não definir erro aqui para evitar recarregar a página
    }
  };

  const startGame = async () => {
    try {
      console.log("Tentando iniciar o jogo...");
      setIsLoading(true);

      // Verificar se o jogo está no estado PENDING antes de tentar iniciar
      if (game?.status !== "PENDING") {
        console.error(`Não é possível iniciar o jogo no estado: ${game?.status}`);
        toast.error("O jogo não está pronto para iniciar");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/crash/game/${game?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "RUNNING" }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro ao iniciar o jogo:", data.error);
        toast.error(data.error || "Erro ao iniciar o jogo");
        setIsLoading(false);
        return;
      }

      console.log("Jogo iniciado com sucesso:", data.game);
      setGame(data.game);

      // Definir o tempo de início do jogo quando o status mudar para RUNNING
      if (data.game.status === "RUNNING") {
        setGameStartTime(Date.now());
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao iniciar o jogo:", error);
      toast.error("Erro ao iniciar o jogo");
      setIsLoading(false);
    }
  };

  const handleCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }

    let count = 5;
    setCountdown(count);

    const interval = setInterval(() => {
      count--;
      console.log("Contagem regressiva:", count);
      setCountdown(count);

      if (count <= 0) {
        clearInterval(interval);
        setCountdownInterval(null);
        startGame();
      }
    }, 1000);

    setCountdownInterval(interval);
  };

  // Efeito para iniciar a contagem regressiva quando o jogo estiver no estado PENDING
  useEffect(() => {
    if (game?.status === "PENDING" && !countdownInterval && countdown === null) {
      console.log("Iniciando contagem regressiva para o jogo PENDING");
      handleCountdown();
    }
  }, [game?.status, countdownInterval, countdown]);

  // Limpar o intervalo quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [countdownInterval]);

  // Renderizar o gráfico do jogo
  useEffect(() => {
    if (!game || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar o tamanho do canvas para corresponder ao tamanho do elemento
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    // Chamar resize inicialmente e adicionar listener para redimensionamento
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Função para desenhar o gráfico
    const drawGraph = (multiplier: number) => {
      if (!ctx || !canvas) return;

      // Limpar o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Configurações do gráfico
      const padding = 20;
      const width = canvas.width - padding * 2;
      const height = canvas.height - padding * 2;
      const originX = padding;
      const originY = canvas.height - padding;

      // Desenhar eixos
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      // Eixo X
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + width, originY);
      ctx.stroke();

      // Eixo Y
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, originY - height);
      ctx.stroke();

      // Desenhar linhas de grade
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';

      // Linhas horizontais (multiplicadores)
      const multipliers = [1, 1.5, 2, 3, 5, 10];
      multipliers.forEach(m => {
        const y = originY - (height * (m - 1) / 10);
        if (y >= originY - height) {
          ctx.beginPath();
          ctx.moveTo(originX, y);
          ctx.lineTo(originX + width, y);
          ctx.stroke();

          // Texto do multiplicador
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '10px Arial';
          ctx.textAlign = 'right';
          ctx.fillText(`${m.toFixed(1)}x`, originX - 5, y + 3);
        }
      });

      // Desenhar a curva do multiplicador
      ctx.strokeStyle = '#FFD700'; // Amarelo dourado
      ctx.lineWidth = 3;
      ctx.beginPath();

      // Começar do ponto de origem
      ctx.moveTo(originX, originY);

      // Calcular a escala X com base no multiplicador
      // Quanto maior o multiplicador, mais longa a curva
      const scaleX = width / (multiplier * 0.5);

      // Desenhar a curva exponencial
      for (let x = 0; x <= width; x += 1) {
        const t = x / scaleX;
        const m = Math.pow(1.0003, t * 1000);

        // Limitar o multiplicador para o intervalo visível
        if (m > 10) break;

        // Calcular a posição Y com base no multiplicador
        const y = originY - (height * (m - 1) / 10);

        // Adicionar ponto à curva
        ctx.lineTo(originX + x, y);
      }

      ctx.stroke();

      // Desenhar o multiplicador atual
      const currentX = originX + (width * 0.8); // Posição X fixa para o texto
      const currentY = originY - (height * (multiplier - 1) / 10);

      // Círculo no ponto atual
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Texto do multiplicador atual
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${multiplier.toFixed(2)}x`, currentX, currentY - 15);
    };

    // Função para animar o gráfico
    const animate = () => {
      if (!gameStartTime || game.status !== 'RUNNING') return;

      // Calcular o tempo decorrido desde o início do jogo
      const elapsedTime = Date.now() - gameStartTime;

      // Calcular o multiplicador atual com base no tempo decorrido
      const multiplier = calculateMultiplier(elapsedTime);
      // console.log(`Tempo decorrido: ${elapsedTime}ms, Multiplicador: ${multiplier.toFixed(2)}x`);

      // Atualizar o estado do multiplicador atual
      setCurrentMultiplier(multiplier);

      // Verificar se o multiplicador atingiu o ponto de crash
      if (game.crashPoint && multiplier >= game.crashPoint) {
        console.log(`Jogo crashou em ${multiplier.toFixed(2)}x (ponto de crash: ${game.crashPoint})`);

        // Verificar se o jogo ainda está em estado RUNNING antes de tentar atualizá-lo
        if (game.status === 'RUNNING') {
          // Atualizar o status do jogo para CRASHED
          fetch('/api/crash/game', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gameId: game.id,
              status: 'CRASHED',
            }),
          })
            .then(response => {
              if (!response.ok) {
                return response.json().then(data => {
                  console.error('Erro ao atualizar status do jogo:', data.error);
                  // Não definir erro aqui para evitar recarregar a página
                  throw new Error(data.error || 'Erro ao atualizar status do jogo');
                });
              }
              return response.json();
            })
            .then(data => {
              console.log('Jogo finalizado:', data);
            })
            .catch(err => {
              console.error('Erro ao atualizar status do jogo:', err);
              // Não definir erro aqui para evitar recarregar a página
            });
        } else {
          console.log('Jogo não está mais em estado RUNNING, ignorando atualização');
        }

        // Parar a animação
        return;
      }

      // Desenhar o gráfico com o multiplicador atual
      drawGraph(multiplier);

      // Verificar auto-cashout para a aposta do usuário
      if (userBet && userBet.status === 'ACTIVE' && userBet.autoWithdrawAt && multiplier >= userBet.autoWithdrawAt) {
        handleCashout();
      }

      // Continuar a animação
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Iniciar ou parar a animação com base no status do jogo
    if (game.status === 'RUNNING' && gameStartTime) {
      // Iniciar a animação
      animate();
    } else if (game.status === 'CRASHED' && game.crashPoint) {
      // Desenhar o gráfico final com o ponto de crash
      drawGraph(game.crashPoint);
    } else {
      // Desenhar o gráfico inicial
      drawGraph(1.00);
    }

    // Limpar ao desmontar
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStartTime, game?.status, game?.id, game?.crashPoint, userBet, handleCashout]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-[url('/tiger-pattern.png')] opacity-5 z-0 pointer-events-none"></div>

      {/* Header */}
      <Header user={user} onLogout={handleLogout} onAddBalance={() => handleAddBalance(100)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Crash Game</span>
            <span className="ml-2 text-sm bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">Beta</span>
          </h1>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>Voltar ao Dashboard</span>
          </Link>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área do jogo */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico do jogo */}
            <CrashGraph
              game={game}
              gameStartTime={gameStartTime}
              countdown={countdown}
              currentMultiplier={currentMultiplier}
              setCurrentMultiplier={setCurrentMultiplier}
              onCrash={handleCrash}
            />

            {/* Lista de apostas */}
            <BetList bets={bets} user={user} />
          </div>

          {/* Painel de apostas */}
          <div className="lg:col-span-1">
            <BetPanel
              game={game}
              userBet={userBet}
              currentMultiplier={currentMultiplier}
              onPlaceBet={handlePlaceBet}
              onCashout={handleCashout}
              placingBet={placingBet}
              cashingOut={cashingOut}
            />
          </div>
        </div>

        {/* Histórico de apostas do usuário */}
        <UserBetHistory userBetHistory={userBetHistory} loadingHistory={loadingHistory} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}