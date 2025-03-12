'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

interface Bet {
  id: string;
  amount: number;
  potentialWin: number;
  status: string;
  createdAt: string;
  selection: {
    id: string;
    name: string;
    odds: number;
    status: string;
    market: {
      id: string;
      name: string;
      event: {
        id: string;
        name: string;
        startTime: string;
        status: string;
        sport: {
          id: string;
          name: string;
        };
      };
    };
  };
}

export default function MyBets() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me');
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

    const fetchBets = async () => {
      try {
        const response = await fetch('/api/bets');
        if (!response.ok) {
          throw new Error('Erro ao buscar apostas');
        }
        
        const data = await response.json();
        setBets(data.bets);
      } catch (err) {
        console.error('Erro ao buscar apostas:', err);
        setError('Erro ao carregar apostas');
      }
    };

    Promise.all([fetchUserData(), fetchBets()])
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBetStatusClass = (status: string) => {
    switch (status) {
      case 'WON':
        return 'bg-green-500 text-white';
      case 'LOST':
        return 'bg-red-500 text-white';
      case 'VOID':
      case 'CANCELLED':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-yellow-500 text-black';
    }
  };

  const getBetStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'WON':
        return 'Ganhou';
      case 'LOST':
        return 'Perdeu';
      case 'VOID':
        return 'Anulada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            Tigrinho <span className="text-yellow-500">BET</span>
          </Link>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="block">Olá, {user.name}</span>
                <span className="block font-semibold">
                  Saldo: R$ {user.balance.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Minhas Apostas</h1>
          <Link
            href="/dashboard"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm transition-colors"
          >
            Voltar ao Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {bets.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-lg mb-4">Você ainda não fez nenhuma aposta.</p>
            <Link
              href="/dashboard"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-medium inline-block transition-colors"
            >
              Fazer apostas
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bets.map((bet) => (
              <div key={bet.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gray-700 px-6 py-4">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="text-sm text-gray-400">
                        {bet.selection.market.event.sport.name} - {bet.selection.market.name}
                      </div>
                      <h3 className="text-lg font-semibold">
                        {bet.selection.market.event.name}
                      </h3>
                      <div className="text-sm text-gray-400">
                        {formatDate(bet.selection.market.event.startTime)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        Aposta feita em {formatDate(bet.createdAt)}
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getBetStatusClass(
                          bet.status
                        )}`}
                      >
                        {getBetStatusText(bet.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Seleção</div>
                      <div className="font-medium">{bet.selection.name}</div>
                      <div className="text-sm">Odds: {bet.selection.odds.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Valor apostado</div>
                      <div className="font-medium">R$ {bet.amount.toFixed(2)}</div>
                      <div className="text-sm">
                        Possível retorno: R$ {bet.potentialWin.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 