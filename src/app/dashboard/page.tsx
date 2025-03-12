'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaWallet, FaUser, FaGamepad, FaFootballBall, FaGift } from 'react-icons/fa';
import { RiVipCrownFill } from 'react-icons/ri';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        setError('Erro ao carregar dados do usuário');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
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
          <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>
          <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm">
            <RiVipCrownFill />
            <span>Nível Iniciante</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 flex items-center">
            <div className="w-10 h-10 min-w-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-500">!</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Jogos de Cassino */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 overflow-hidden group hover:border-yellow-500/30 transition-all">
            <div className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3">
                  <FaGamepad className="text-yellow-500" />
                </div>
                <h2 className="text-xl font-semibold">Jogos de Cassino</h2>
              </div>
              <p className="text-gray-400 mb-6">
                Experimente nossos jogos de cassino exclusivos com altas chances de ganhar!
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <Link
                  href="/cassino/crash"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium py-3 px-4 rounded-xl text-center transition-all group-hover:shadow-md group-hover:shadow-yellow-500/20 flex items-center justify-center"
                >
                  <span>Crash Game</span>
                  <span className="ml-2 bg-black/10 rounded-full w-6 h-6 flex items-center justify-center text-xs">🎲</span>
                </Link>
                
                <button
                  disabled
                  className="bg-gray-700/50 text-gray-400 font-medium py-3 px-4 rounded-xl text-center cursor-not-allowed flex items-center justify-center"
                >
                  <span>Slots</span>
                  <span className="ml-2 bg-black/10 rounded-full w-6 h-6 flex items-center justify-center text-xs">🎰</span>
                  <span className="ml-2 text-xs bg-gray-600/50 px-2 py-0.5 rounded-full">Em breve</span>
                </button>
                
                <button
                  disabled
                  className="bg-gray-700/50 text-gray-400 font-medium py-3 px-4 rounded-xl text-center cursor-not-allowed flex items-center justify-center"
                >
                  <span>Roleta</span>
                  <span className="ml-2 bg-black/10 rounded-full w-6 h-6 flex items-center justify-center text-xs">🎯</span>
                  <span className="ml-2 text-xs bg-gray-600/50 px-2 py-0.5 rounded-full">Em breve</span>
                </button>
              </div>
            </div>
          </div>

          {/* Apostas Esportivas */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 overflow-hidden group hover:border-green-500/30 transition-all">
            <div className="h-3 bg-gradient-to-r from-green-500 to-green-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mr-3">
                  <FaFootballBall className="text-green-500" />
                </div>
                <h2 className="text-xl font-semibold">Apostas Esportivas</h2>
              </div>
              <p className="text-gray-400 mb-6">
                Aposte nos seus times favoritos e acompanhe os resultados em tempo real.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <Link
                  href="/sports"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl text-center transition-all group-hover:shadow-md group-hover:shadow-green-500/20 flex items-center justify-center"
                >
                  <span>Futebol</span>
                  <span className="ml-2 bg-black/10 rounded-full w-6 h-6 flex items-center justify-center text-xs">⚽</span>
                </Link>
                
                <button
                  disabled
                  className="bg-gray-700/50 text-gray-400 font-medium py-3 px-4 rounded-xl text-center cursor-not-allowed flex items-center justify-center"
                >
                  <span>Basquete</span>
                  <span className="ml-2 bg-black/10 rounded-full w-6 h-6 flex items-center justify-center text-xs">🏀</span>
                  <span className="ml-2 text-xs bg-gray-600/50 px-2 py-0.5 rounded-full">Em breve</span>
                </button>
                
                <button
                  disabled
                  className="bg-gray-700/50 text-gray-400 font-medium py-3 px-4 rounded-xl text-center cursor-not-allowed flex items-center justify-center"
                >
                  <span>Tênis</span>
                  <span className="ml-2 bg-black/10 rounded-full w-6 h-6 flex items-center justify-center text-xs">🎾</span>
                  <span className="ml-2 text-xs bg-gray-600/50 px-2 py-0.5 rounded-full">Em breve</span>
                </button>
              </div>
            </div>
          </div>

          {/* Promoções */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="h-3 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
                  <FaGift className="text-purple-500" />
                </div>
                <h2 className="text-xl font-semibold">Promoções</h2>
              </div>
              <p className="text-gray-400 mb-6">
                Confira nossas promoções exclusivas e ganhe bônus incríveis!
              </p>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-yellow-500/30 transition-all">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="text-yellow-500 mr-2">🎁</span>
                    Bônus de Boas-vindas
                  </h3>
                  <p className="text-sm text-gray-400">
                    Ganhe 100% de bônus no seu primeiro depósito até R$ 500.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-yellow-500/30 transition-all">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="text-yellow-500 mr-2">👥</span>
                    Indique um Amigo
                  </h3>
                  <p className="text-sm text-gray-400">
                    Ganhe R$ 50 para cada amigo que se cadastrar usando seu código.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-yellow-500/30 transition-all">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="text-yellow-500 mr-2">💰</span>
                    Cashback Semanal
                  </h3>
                  <p className="text-sm text-gray-400">
                    Receba 10% de cashback em todas as suas apostas perdidas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Histórico de Apostas */}
        <div className="mt-8 bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold mb-6">Histórico de Apostas</h2>
          
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-gray-400">Você ainda não fez nenhuma aposta.</p>
            <p className="text-gray-400 mt-2">Comece a jogar agora e acompanhe seu histórico aqui!</p>
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