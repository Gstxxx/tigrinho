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

interface Selection {
  id: string;
  name: string;
  odds: number;
  status: string;
}

interface Market {
  id: string;
  name: string;
  selections: Selection[];
}

interface Event {
  id: string;
  name: string;
  startTime: string;
  status: string;
  sport: {
    id: string;
    name: string;
  };
  markets: Market[];
}

export default function EventDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [betAmount, setBetAmount] = useState<number>(10);
  const [selectedSelection, setSelectedSelection] = useState<Selection | null>(null);
  const [placingBet, setPlacingBet] = useState(false);
  const [betSuccess, setBetSuccess] = useState(false);
  const [betError, setBetError] = useState('');

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

    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do evento');
        }
        
        const data = await response.json();
        setEvent(data.event);
      } catch (err) {
        console.error('Erro ao buscar evento:', err);
        setError('Erro ao carregar dados do evento');
      }
    };

    Promise.all([fetchUserData(), fetchEventData()])
      .finally(() => setLoading(false));
  }, [router, params.id]);

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

  const handleSelectionClick = (selection: Selection) => {
    setSelectedSelection(selection);
    setBetError('');
    setBetSuccess(false);
  };

  const handlePlaceBet = async () => {
    if (!selectedSelection) {
      setBetError('Selecione uma opção para apostar');
      return;
    }

    if (betAmount <= 0) {
      setBetError('O valor da aposta deve ser maior que zero');
      return;
    }

    if (user && betAmount > user.balance) {
      setBetError('Saldo insuficiente para realizar esta aposta');
      return;
    }

    setPlacingBet(true);
    setBetError('');
    setBetSuccess(false);

    try {
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectionId: selectedSelection.id,
          amount: betAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar aposta');
      }

      // Atualizar o saldo do usuário
      if (user && data.balance !== undefined) {
        setUser({
          ...user,
          balance: data.balance,
        });
      }

      setBetSuccess(true);
      setSelectedSelection(null);
    } catch (err) {
      console.error('Erro ao realizar aposta:', err);
      setBetError(err instanceof Error ? err.message : 'Erro ao realizar aposta');
    } finally {
      setPlacingBet(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Evento não encontrado</div>
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
        {/* Detalhes do evento */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link 
              href="/dashboard" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Voltar
            </Link>
            <span className="text-gray-500">/</span>
            <span>{event.sport.name}</span>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
                <p className="text-gray-400">{formatDate(event.startTime)}</p>
              </div>
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-medium">
                {event.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mercados e seleções */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Mercados disponíveis</h2>
            
            {event.markets.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p>Nenhum mercado disponível para este evento.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {event.markets.map((market) => (
                  <div key={market.id} className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-gray-700 px-4 py-3">
                      <h3 className="font-semibold">{market.name}</h3>
                    </div>
                    
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {market.selections.map((selection) => (
                        <button
                          key={selection.id}
                          onClick={() => handleSelectionClick(selection)}
                          className={`p-3 rounded-md flex flex-col items-center justify-between transition-colors ${
                            selectedSelection?.id === selection.id
                              ? 'bg-yellow-500 text-black'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          disabled={selection.status !== 'OPEN'}
                        >
                          <span className="text-sm mb-1">{selection.name}</span>
                          <span className="font-bold">{selection.odds.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cupom de apostas */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Cupom de apostas</h2>
              
              {betSuccess && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-lg mb-4">
                  Aposta realizada com sucesso!
                </div>
              )}
              
              {betError && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
                  {betError}
                </div>
              )}
              
              {selectedSelection ? (
                <div>
                  <div className="bg-gray-700 p-3 rounded-md mb-4">
                    <div className="text-sm text-gray-400 mb-1">{event.name}</div>
                    <div className="flex justify-between items-center">
                      <span>{selectedSelection.name}</span>
                      <span className="font-bold">{selectedSelection.odds.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="betAmount" className="block text-sm font-medium mb-1">
                      Valor da aposta (R$)
                    </label>
                    <input
                      id="betAmount"
                      type="number"
                      min="1"
                      step="1"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div className="bg-gray-700 p-3 rounded-md mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Possível retorno:</span>
                      <span className="font-bold">
                        R$ {(betAmount * selectedSelection.odds).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePlaceBet}
                    disabled={placingBet}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {placingBet ? 'Processando...' : 'Fazer aposta'}
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Selecione uma opção para apostar
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 