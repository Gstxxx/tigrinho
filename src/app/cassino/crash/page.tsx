'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCrashOdds, calculateMultiplier } from '@/lib/crash';
import { FaWallet, FaUser, FaSignOutAlt, FaHistory, FaChartLine, FaUsers, FaInfoCircle } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

interface CrashBet {
  id: string;
  amount: number;
  status: string;
  cashoutMultiplier: number | null;
  autoWithdrawAt: number | null;
  profit: number | null;
  userId: string;
  userName: string;
}

interface CrashGame {
  id: string;
  hash: string;
  status: string;
  createdAt: string;
  crashPoint?: number;
  seed?: string;
}

interface UserBet extends CrashBet {
  createdAt: string;
  game: {
    id: string;
    crashPoint: number;
    status: string;
    createdAt: string;
  }
}

interface GameHistoryItem {
  id: string;
  crashPoint: number;
  createdAt: string;
}

export default function CrashGame() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<CrashGame | null>(null);
  const [bets, setBets] = useState<CrashBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [betAmount, setBetAmount] = useState<number>(10);
  const [autoWithdrawAt, setAutoWithdrawAt] = useState<number | null>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [userBet, setUserBet] = useState<CrashBet | null>(null);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [placingBet, setPlacingBet] = useState(false);
  const [cashingOut, setCashingOut] = useState(false);
  const [countdown, setCountdown] = useState<number>(10); // Temporizador para início do jogo
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [userBetHistory, setUserBetHistory] = useState<UserBet[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Obter as odds do jogo
  const crashOdds = getCrashOdds();

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
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
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
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      
      // Definir a contagem regressiva inicial
      setCountdown(10);
      
      // Iniciar a contagem regressiva
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          // Quando a contagem chegar a zero, atualizar o status do jogo para RUNNING
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!);
            
            // Atualizar o status do jogo para RUNNING
            fetch('/api/crash/game', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                gameId: game.id,
                status: 'RUNNING',
              }),
            })
            .then(response => response.json())
            .then(data => {
              console.log('Jogo iniciado:', data);
              // Definir o tempo de início do jogo
              setGameStartTime(Date.now());
            })
            .catch(err => {
              console.error('Erro ao iniciar jogo:', err);
              setError('Erro ao iniciar jogo');
            });
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Limpar o intervalo quando o componente for desmontado
      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      };
    }
    
    // Quando o jogo estiver em estado RUNNING, iniciar a animação
    if (game.status === 'RUNNING') {
      console.log('Jogo em estado RUNNING, iniciando animação');
      
      // Definir o tempo de início do jogo se ainda não estiver definido
      if (!gameStartTime) {
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

    if (user) {
      fetchUserBetHistory();
    }
  }, [user]);

  // Buscar histórico de jogos
  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await fetch('/api/crash/history');
        if (!response.ok) {
          throw new Error('Erro ao buscar histórico de jogos');
        }
        
        const data = await response.json();
        setGameHistory(data.history.map((h: GameHistoryItem) => h.crashPoint));
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      }
    };

    fetchGameHistory();
  }, []);

  // Função para fazer uma aposta
  const handlePlaceBet = async () => {
    if (!user || !game || betAmount <= 0) return;
    
    setPlacingBet(true);
    
    try {
      const response = await fetch('/api/crash/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
          amount: betAmount,
          autoWithdrawAt: autoWithdrawAt,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer aposta');
      }
      
      // Atualizar o saldo do usuário
      setUser({
        ...user,
        balance: user.balance - betAmount,
      });
      
      // Atualizar a aposta do usuário
      setUserBet(data.bet);
      
      // Atualizar a lista de apostas
      setBets([...bets, data.bet]);
    } catch (err) {
      console.error('Erro ao fazer aposta:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer aposta');
    } finally {
      setPlacingBet(false);
    }
  };

  // Função para sacar (cashout)
  const handleCashout = async () => {
    if (!user || !game || !userBet) return;
    
    setCashingOut(true);
    
    try {
      const response = await fetch('/api/crash/cashout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
          betId: userBet.id,
          multiplier: currentMultiplier,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer cashout');
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
      setError(err instanceof Error ? err.message : 'Erro ao fazer cashout');
    } finally {
      setCashingOut(false);
    }
  };

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

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
      console.log(`Tempo decorrido: ${elapsedTime}ms, Multiplicador: ${multiplier.toFixed(2)}x`);
      
      // Atualizar o estado do multiplicador atual
      setCurrentMultiplier(multiplier);
      
      // Verificar se o multiplicador atingiu o ponto de crash
      if (game.crashPoint && multiplier >= game.crashPoint) {
        console.log(`Jogo crashou em ${multiplier.toFixed(2)}x (ponto de crash: ${game.crashPoint})`);
        
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
        .catch(err => {
          console.error('Erro ao atualizar status do jogo:', err);
        });
        
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

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl text-gray-300">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-[url('/tiger-pattern.png')] opacity-5 z-0 pointer-events-none"></div>
      
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md shadow-lg shadow-yellow-500/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-extrabold flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Tigrinho</span>
            <span className="ml-2 bg-yellow-500 px-2 py-1 rounded text-black">BET</span>
          </Link>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 rounded-full py-1 px-4 flex items-center">
                <FaWallet className="text-yellow-500 mr-2" />
                <span className="text-sm font-medium">
                  R$ {user.balance.toFixed(2)}
                </span>
                <button className="ml-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 text-xs rounded-md px-2 py-0.5 transition-colors">
                  +
                </button>
              </div>
              
              <div className="relative group">
                <button className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 rounded-full py-1 px-4 hover:border-yellow-500/30 transition-colors">
                  <FaUser className="text-gray-400" />
                  <span className="text-sm">{user.name}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg shadow-black/50 border border-gray-700/50 p-2 hidden group-hover:block">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <FaChartLine />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

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

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 flex items-center">
            <div className="w-10 h-10 min-w-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-500">!</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área do jogo */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico do jogo */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 overflow-hidden">
              <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3">
                    <FaChartLine className="text-yellow-500" />
                  </div>
                  <h2 className="font-semibold">Crash Game</h2>
                </div>
                
                <div className="flex items-center">
                  {game?.status === 'PENDING' && (
                    <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center">
                      <span>Próximo jogo em {countdown}s</span>
                    </div>
                  )}
                  
                  {game?.status === 'RUNNING' && (
                    <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                      <span className="animate-pulse mr-1">●</span>
                      <span>{currentMultiplier.toFixed(2)}x</span>
                    </div>
                  )}
                  
                  {game?.status === 'CRASHED' && (
                    <div className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm flex items-center">
                      <span>Crash em {game.crashPoint?.toFixed(2)}x</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative aspect-video bg-gray-900/50 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                ></canvas>
                
                {game?.status === 'CRASHED' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-500 mb-2">CRASH!</div>
                      <div className="text-2xl font-bold text-white">{game.crashPoint?.toFixed(2)}x</div>
                    </div>
                  </div>
                )}
                
                {game?.status === 'PENDING' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-500 mb-2">PREPARANDO</div>
                      <div className="text-2xl font-bold text-white">Próximo jogo em {countdown}s</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-700/50">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {gameHistory.slice(0, 10).map((point, index) => (
                    <div 
                      key={index} 
                      className={`flex-shrink-0 w-14 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                        point < 2 ? 'bg-red-500/20 text-red-400' : 
                        point < 4 ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {point.toFixed(2)}x
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de apostas */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 overflow-hidden">
              <div className="p-4 border-b border-gray-700/50 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
                  <FaUsers className="text-purple-500" />
                </div>
                <h2 className="font-semibold">Apostas Ativas</h2>
              </div>
              
              <div className="overflow-x-auto">
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 text-sm">
                        <th className="pb-3 pl-2">Jogador</th>
                        <th className="pb-3">Valor</th>
                        <th className="pb-3">Auto-Sacar</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Multiplicador</th>
                        <th className="pb-3">Lucro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {bets.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-gray-400">
                            Nenhuma aposta ainda. Seja o primeiro a apostar!
                          </td>
                        </tr>
                      ) : (
                        bets.map((bet) => (
                          <tr key={bet.id} className={`${bet.userId === user?.id ? 'bg-yellow-500/5' : ''}`}>
                            <td className="py-3 pl-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mr-2 text-sm">
                                  {bet.userName.charAt(0).toUpperCase()}
                                </div>
                                <span className={`${bet.userId === user?.id ? 'font-medium text-yellow-500' : ''}`}>
                                  {bet.userName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 font-medium">R$ {bet.amount.toFixed(2)}</td>
                            <td className="py-3">
                              {bet.autoWithdrawAt ? `${bet.autoWithdrawAt.toFixed(2)}x` : '-'}
                            </td>
                            <td className="py-3">
                              {bet.status === 'ACTIVE' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                  Ativo
                                </span>
                              )}
                              {bet.status === 'CASHED_OUT' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                  Sacado
                                </span>
                              )}
                              {bet.status === 'LOST' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                                  Perdido
                                </span>
                              )}
                            </td>
                            <td className="py-3">
                              {bet.cashoutMultiplier ? `${bet.cashoutMultiplier.toFixed(2)}x` : '-'}
                            </td>
                            <td className="py-3 font-medium">
                              {bet.profit !== null 
                                ? <span className={bet.profit > 0 ? 'text-green-500' : 'text-red-500'}>
                                    {bet.profit > 0 ? '+' : ''}{bet.profit.toFixed(2)}
                                  </span>
                                : '-'
                              }
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Painel de apostas */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 sticky top-24">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3">
                    <FaWallet className="text-yellow-500" />
                  </div>
                  <h2 className="font-semibold">Fazer Aposta</h2>
                </div>
                
                {game && game.status === 'RUNNING' && userBet && userBet.status === 'ACTIVE' ? (
                  <div>
                    <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 p-4 rounded-xl border border-gray-700/50 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Valor apostado:</span>
                        <span className="font-bold">R$ {userBet.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Multiplicador atual:</span>
                        <span className="font-bold text-yellow-500">{currentMultiplier.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Possível ganho:</span>
                        <span className="font-bold text-green-500">
                          R$ {(userBet.amount * currentMultiplier).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCashout}
                      disabled={cashingOut}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {cashingOut ? 'Processando...' : `Sacar ${currentMultiplier.toFixed(2)}x`}
                      </span>
                      <span className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="betAmount" className="block text-sm font-medium mb-2 text-gray-300">
                          Valor da aposta (R$)
                        </label>
                        <input
                          id="betAmount"
                          type="number"
                          min="1"
                          step="1"
                          value={betAmount}
                          onChange={(e) => setBetAmount(Number(e.target.value))}
                          disabled={game?.status !== 'PENDING' || userBet !== null}
                          className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all disabled:opacity-50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="autoWithdrawAt" className="block text-sm font-medium mb-2 text-gray-300">
                          Auto-sacar em (opcional)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id="autoWithdrawAt"
                            type="number"
                            min="1.1"
                            step="0.1"
                            value={autoWithdrawAt || ''}
                            onChange={(e) => setAutoWithdrawAt(e.target.value ? Number(e.target.value) : null)}
                            disabled={game?.status !== 'PENDING' || userBet !== null}
                            placeholder="Ex: 2.0"
                            className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all disabled:opacity-50"
                          />
                          <span className="text-lg">x</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handlePlaceBet}
                        disabled={placingBet || game?.status !== 'PENDING' || userBet !== null}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden mt-2"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          {placingBet ? 'Processando...' : 'Fazer Aposta'}
                        </span>
                        <span className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                      </button>
                      
                      {userBet && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-700/50">
                          <p className="text-sm text-center">
                            {userBet.status === 'CASHED_OUT'
                              ? <span className="text-green-400">Você sacou em <span className="font-bold">{userBet.cashoutMultiplier}x</span> e ganhou <span className="font-bold">R$ {userBet.profit?.toFixed(2)}</span></span>
                              : userBet.status === 'LOST'
                                ? <span className="text-red-400">Você perdeu sua aposta</span>
                                : <span className="text-blue-400">Aposta realizada. Aguardando início do jogo.</span>}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Informações do jogo */}
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="flex items-center mb-3">
                    <FaInfoCircle className="text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium">Informações do jogo</h3>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-800/30 p-3 rounded-xl">
                    <p className="mb-1 flex justify-between">
                      <span>Hash:</span> 
                      <span className="font-mono">{game?.hash.substring(0, 16)}...</span>
                    </p>
                    {game?.status === 'CRASHED' && game?.seed && (
                      <p className="mb-1 flex justify-between">
                        <span>Seed:</span> 
                        <span className="font-mono">{game.seed.substring(0, 16)}...</span>
                      </p>
                    )}
                    <p className="flex justify-between">
                      <span>Status:</span>
                      <span className={`
                        ${game?.status === 'PENDING' ? 'text-blue-400' : ''}
                        ${game?.status === 'RUNNING' ? 'text-yellow-400' : ''}
                        ${game?.status === 'CRASHED' ? 'text-red-400' : ''}
                      `}>
                        {game?.status === 'PENDING' ? 'Aguardando' : ''}
                        {game?.status === 'RUNNING' ? 'Em andamento' : ''}
                        {game?.status === 'CRASHED' ? 'Crashou' : ''}
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Odds do jogo */}
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium">Probabilidades do Crash</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {crashOdds.map((odd) => (
                      <div key={odd.multiplier} className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg p-2 flex justify-between border border-gray-700/50">
                        <span className="text-yellow-500 font-medium">{odd.multiplier.toFixed(1)}x</span>
                        <span className="text-gray-300">{(odd.probability * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    * Probabilidade de crash ser maior ou igual ao multiplicador
                  </p>
                </div>
                
                {/* Histórico de jogos */}
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="flex items-center mb-3">
                    <FaHistory className="text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium">Últimos resultados</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gameHistory.slice(0, 10).map((point, index) => (
                      <div 
                        key={index} 
                        className={`
                          w-14 h-8 rounded-lg flex items-center justify-center text-xs font-medium
                          ${point < 2 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                            point >= 10 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}
                        `}
                      >
                        {point.toFixed(2)}x
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Histórico de apostas do usuário */}
        <div className="mt-8 bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 overflow-hidden">
          <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                <FaHistory className="text-blue-500" />
              </div>
              <h2 className="font-semibold">Seu Histórico de Apostas</h2>
            </div>
            <div className="text-xs text-gray-400">
              {userBetHistory.length > 0 ? `${userBetHistory.length} apostas encontradas` : ''}
            </div>
          </div>
          
          <div className="overflow-hidden">
            <div className="p-4">
              {loadingHistory ? (
                <div className="text-center py-4">
                  <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-gray-400">Carregando histórico...</p>
                </div>
              ) : userBetHistory.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-400">Você ainda não fez nenhuma aposta.</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}>
                  <table className="w-full">
                    <thead className="sticky top-0 bg-gray-900/90 z-10">
                      <tr className="text-left text-gray-400 text-sm">
                        <th className="pb-3 pl-2">Data</th>
                        <th className="pb-3">Valor</th>
                        <th className="pb-3">Multiplicador</th>
                        <th className="pb-3">Crash Point</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Lucro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {userBetHistory.map((bet) => (
                        <tr key={bet.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3 pl-2 text-sm">{formatDate(bet.createdAt)}</td>
                          <td className="py-3 font-medium">R$ {bet.amount.toFixed(2)}</td>
                          <td className="py-3">
                            {bet.cashoutMultiplier ? `${bet.cashoutMultiplier.toFixed(2)}x` : '-'}
                          </td>
                          <td className="py-3">
                            {bet.game.crashPoint ? `${bet.game.crashPoint.toFixed(2)}x` : '-'}
                          </td>
                          <td className="py-3">
                            {bet.status === 'ACTIVE' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                Ativo
                              </span>
                            )}
                            {bet.status === 'CASHED_OUT' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                Sacado
                              </span>
                            )}
                            {bet.status === 'LOST' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                                Perdido
                              </span>
                            )}
                          </td>
                          <td className="py-3 font-medium">
                            {bet.profit !== null 
                              ? <span className={bet.profit > 0 ? 'text-green-500' : 'text-red-500'}>
                                  {bet.profit > 0 ? '+' : ''}{bet.profit.toFixed(2)}
                                </span>
                              : '-'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-md border-t border-gray-800/50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2023 Tigrinho BET. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="text-gray-500 hover:text-yellow-500 text-sm transition-colors">Termos</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-yellow-500 text-sm transition-colors">Privacidade</Link>
            <Link href="/responsible" className="text-gray-500 hover:text-yellow-500 text-sm transition-colors">Jogo Responsável</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}