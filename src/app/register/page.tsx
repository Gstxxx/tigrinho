'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }
      
      // Redirecionar para o login após o registro
      router.push('/login');
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/tiger-pattern.png')] opacity-5 z-0"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-extrabold flex items-center justify-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Tigrinho</span>
              <span className="ml-2 bg-yellow-500 px-2 py-1 rounded text-black">BET</span>
            </div>
          </Link>
          <p className="text-gray-400 mt-3">Crie sua conta e comece a apostar</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 p-8 border border-gray-700/50">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 flex items-center">
              <div className="w-10 h-10 min-w-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-500">!</span>
              </div>
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                Nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  placeholder="********"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">A senha deve ter pelo menos 6 caracteres</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-gray-300">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  placeholder="********"
                  required
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                  {!loading && <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />}
                </span>
                <span className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-yellow-500 hover:text-yellow-400 font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2023 Tigrinho BET. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="hover:text-yellow-500 transition-colors">Termos</Link>
            <Link href="/privacy" className="hover:text-yellow-500 transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 