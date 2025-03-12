'use client';

import { FaUsers } from 'react-icons/fa';
import { CrashBet, User } from './types';

interface BetListProps {
    bets: CrashBet[];
    user: User | null;
}

export default function BetList({ bets, user }: BetListProps) {
    return (
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
    );
} 