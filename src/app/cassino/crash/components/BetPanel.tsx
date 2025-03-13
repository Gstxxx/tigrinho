'use client';

import { useState } from 'react';
import { FaWallet, FaInfoCircle, FaChartLine, FaHistory } from 'react-icons/fa';
import { CrashGame, CrashBet } from './types';
import { getCrashOdds } from '@/lib/crash';

interface BetPanelProps {
    game: CrashGame | null;
    userBet: CrashBet | null;
    currentMultiplier: number;
    onPlaceBet: (amount: number, autoWithdrawAt: number | null) => Promise<void>;
    onCashout: () => Promise<void>;
    placingBet: boolean;
    cashingOut: boolean;
}

export default function BetPanel({
    game,
    userBet,
    currentMultiplier,
    onPlaceBet,
    onCashout,
    placingBet,
    cashingOut
}: BetPanelProps) {
    const [betAmount, setBetAmount] = useState<number>(10);
    const [autoWithdrawAt, setAutoWithdrawAt] = useState<number | null>(null);

    // Obter as odds do jogo
    const crashOdds = getCrashOdds();

    const handlePlaceBet = () => {
        if (betAmount <= 0) return;
        onPlaceBet(betAmount, autoWithdrawAt);
    };

    return (
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
                            onClick={onCashout}
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
                            <span className="font-mono">{game?.hash ? game.hash.substring(0, 16) + '...' : 'Carregando...'}</span>
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
                        {/* Aqui seria renderizado o histórico de jogos, mas como já está no CrashGraph, podemos remover ou manter como uma visualização alternativa */}
                    </div>
                </div>
            </div>
        </div>
    );
} 