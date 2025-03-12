'use client';

import Link from 'next/link';
import { FaWallet, FaUser, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { User } from './types';

interface HeaderProps {
    user: User | null;
    onLogout: () => Promise<void>;
}

export default function Header({ user, onLogout }: HeaderProps) {
    return (
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
                                    onClick={onLogout}
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
    );
} 