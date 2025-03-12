'use client';

import { FaHistory } from 'react-icons/fa';
import { UserBet } from './types';

interface UserBetHistoryProps {
    userBetHistory: UserBet[];
    loadingHistory: boolean;
}

export default function UserBetHistory({ userBetHistory, loadingHistory }: UserBetHistoryProps) {
    // Formatar data para exibição
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
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
    );
} 