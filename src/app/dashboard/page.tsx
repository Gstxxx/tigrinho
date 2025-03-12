'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

interface Sport {
  id: string;
  name: string;
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
  markets: {
    id: string;
    name: string;
    _count: {
      selections: number;
    };
  }[];
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sports, setSports] = useState<Sport[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

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
        setErrorMessage('Erro ao carregar dados do usuário');
      }
    };

    const fetchSports = async () => {
      try {
        const response = await fetch('/api/sports', {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar esportes');
        }
        
        const data = await response.json();
        setSports(data.sports);
      } catch (err) {
        console.error('Erro ao buscar esportes:', err);
        setErrorMessage('Erro ao carregar esportes');
      }
    };

    Promise.all([fetchUserData(), fetchSports()])
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = selectedSport 
          ? `/api/events?sportId=${selectedSport}&status=UPCOMING` 
          : '/api/events?status=UPCOMING';
        
        const response = await fetch(url, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar eventos');
        }
        
        const data = await response.json();
        setEvents(data.events);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        setErrorMessage('Erro ao carregar eventos');
      }
    };

    fetchEvents();
  }, [selectedSport]);

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
          <h1 className="text-2xl font-bold text-white">
            Tigrinho <span className="text-yellow-500">BET</span>
          </h1>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="block text-white">Olá, {user.name}</span>
                <span className="block font-semibold text-green-500">R$ {user.balance.toFixed(2)}
                </span>
              </div>
              <Link
                href="/bets"
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Minhas Apostas
              </Link>
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
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {errorMessage}
          </div>
        )}
        
        {/* Filtro de esportes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Esportes</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSport(null)}
              className={`px-4 py-2 rounded-md ${
                selectedSport === null
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`px-4 py-2 rounded-md ${
                  selectedSport === sport.id
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de eventos */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
          
          {events.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p>Nenhum evento encontrado para este esporte.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <div className="bg-gray-700 px-4 py-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">{event.sport.name}</span>
                      <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                        {event.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mt-1">{event.name}</h3>
                    <p className="text-sm text-gray-400">{formatDate(event.startTime)}</p>
                  </div>
                  
                  <div className="p-4">
                    <Link 
                      href={`/events/${event.id}`}
                      className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black text-center font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                      Ver Mercados ({event.markets.reduce((acc, market) => acc + market._count.selections, 0)})
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 