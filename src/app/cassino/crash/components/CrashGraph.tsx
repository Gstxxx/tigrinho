'use client';

import { useState, useEffect, useRef } from 'react';
import { CrashGame } from './types';
import { calculateMultiplier } from '@/lib/crash';

interface CrashGraphProps {
    game: CrashGame | null;
    gameStartTime: number | null;
    countdown: number | null;
    currentMultiplier: number;
    setCurrentMultiplier: (multiplier: number) => void;
    onCrash: () => void;
}

interface GameHistoryItem {
    crashPoint: number;
}

export default function CrashGraph({
    game,
    gameStartTime,
    countdown,
    currentMultiplier,
    setCurrentMultiplier,
    onCrash
}: CrashGraphProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [gameHistory, setGameHistory] = useState<number[]>([]);

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

                // Notificar o componente pai sobre o crash
                onCrash();

                // Parar a animação
                return;
            }

            // Desenhar o gráfico com o multiplicador atual
            drawGraph(multiplier);

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
    }, [gameStartTime, game?.status, game?.id, game?.crashPoint, setCurrentMultiplier, onCrash, game]);

    return (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 overflow-hidden">
            <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h2 className="font-semibold">Crash Game</h2>
                </div>

                <div className="flex items-center">
                    {game?.status === 'PENDING' && (
                        <div className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center">
                            <span className="animate-pulse mr-1">●</span>
                            <span>
                                {countdown !== null
                                    ? `Próximo jogo em ${countdown}s`
                                    : 'Iniciando...'}
                            </span>
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
                            <span>Crash em {game?.crashPoint?.toFixed(2)}x</span>
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
                            <div className="text-2xl font-bold text-white">
                                {countdown !== null
                                    ? `Próximo jogo em ${countdown}s`
                                    : 'Iniciando...'}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-700/50">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {gameHistory.slice(0, 10).map((point, index) => (
                        <div
                            key={index}
                            className={`flex-shrink-0 w-14 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${point < 2 ? 'bg-red-500/20 text-red-400' :
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
    );
} 