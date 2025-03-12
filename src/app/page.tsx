import Link from 'next/link';
import { FaLock, FaGift, FaGamepad, FaChartLine } from 'react-icons/fa';
import { IoMdFootball } from 'react-icons/io';
import { BiBasketball, BiTennisBall } from 'react-icons/bi';
import { GiVolleyballBall } from 'react-icons/gi';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md fixed w-full z-50 shadow-lg shadow-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Tigrinho</span>
            <span className="ml-2 bg-yellow-500 px-2 py-1 rounded text-black">BET</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="bg-gray-800/80 hover:bg-gray-700 text-white px-5 py-2 rounded-full text-sm transition-all hover:shadow-md hover:shadow-yellow-500/20"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md hover:shadow-yellow-500/40"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/tiger-pattern.png')] opacity-5 z-0"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-3 bg-yellow-500/10 px-4 py-1 rounded-full">
            <span className="text-yellow-400 text-sm font-medium">Bônus de 100% até R$500</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Aposte com o <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Tigrinho</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            A plataforma mais rápida e segura para suas apostas esportivas e jogos de cassino.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/register"
              className="group relative bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-8 py-4 rounded-xl text-lg font-bold transition-all hover:shadow-lg hover:shadow-yellow-500/30 overflow-hidden"
            >
              <span className="relative z-10">Comece a Ganhar</span>
              <span className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              href="/login"
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white border border-white/10 px-8 py-4 rounded-xl text-lg transition-all hover:shadow-lg"
            >
              Já tenho conta
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <FaLock className="text-yellow-500" />
              <span>Pagamentos Seguros</span>
            </div>
            <div className="flex items-center gap-2">
              <FaGift className="text-yellow-500" />
              <span>Bônus Exclusivos</span>
            </div>
            <div className="flex items-center gap-2">
              <FaGamepad className="text-yellow-500" />
              <span>+1000 Jogos</span>
            </div>
            <div className="flex items-center gap-2">
              <FaChartLine className="text-yellow-500" />
              <span>Melhores Odds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-yellow-500 font-medium mb-2">VANTAGENS EXCLUSIVAS</span>
            <h2 className="text-4xl font-bold">Por que escolher a Tigrinho BET?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl border border-gray-700/50 hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/5 group">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-all">
                <span className="text-yellow-500 text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Apostas Esportivas</h3>
              <p className="text-gray-400">
                Aposte em mais de 30 esportes diferentes com as melhores odds do mercado e acompanhe ao vivo.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl border border-gray-700/50 hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/5 group">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-all">
                <span className="text-yellow-500 text-3xl">🎁</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Bônus Exclusivos</h3>
              <p className="text-gray-400">
                Ganhe até R$ 500 em bônus no seu primeiro depósito e aproveite promoções semanais exclusivas.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl border border-gray-700/50 hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/5 group">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-all">
                <span className="text-yellow-500 text-3xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Apostas ao Vivo</h3>
              <p className="text-gray-400">
                Acompanhe os jogos em tempo real com estatísticas detalhadas e faça suas apostas durante as partidas.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Casino Section */}
      <section className="py-20 bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-yellow-500 font-medium mb-2">CASSINO ONLINE</span>
            <h2 className="text-4xl font-bold">Jogos de Cassino</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/10 group">
              <div className="aspect-video bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 flex items-center justify-center relative overflow-hidden">
                <span className="text-5xl group-hover:scale-125 transition-transform duration-500">🎲</span>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Crash Game</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Aposte e saque antes que o multiplicador caia! Ganhe até 100x o valor da sua aposta.
                </p>
                <Link
                  href="/login"
                  className="block bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black text-center py-3 rounded-lg font-medium transition-all"
                >
                  Jogar Agora
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/10 group">
              <div className="aspect-video bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 flex items-center justify-center relative overflow-hidden">
                <span className="text-5xl group-hover:scale-125 transition-transform duration-500">🎰</span>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Slots</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Mais de 1000 slots dos melhores provedores com jackpots progressivos.
                </p>
                <Link
                  href="/login"
                  className="block bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black text-center py-3 rounded-lg font-medium transition-all"
                >
                  Jogar Agora
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/10 group">
              <div className="aspect-video bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 flex items-center justify-center relative overflow-hidden">
                <span className="text-5xl group-hover:scale-125 transition-transform duration-500">🎯</span>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Roleta</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Roleta ao vivo com dealers profissionais e múltiplas variantes do jogo.
                </p>
                <Link
                  href="/login"
                  className="block bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black text-center py-3 rounded-lg font-medium transition-all"
                >
                  Jogar Agora
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/10 group">
              <div className="aspect-video bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 flex items-center justify-center relative overflow-hidden">
                <span className="text-5xl group-hover:scale-125 transition-transform duration-500">🃏</span>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Blackjack</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Jogue blackjack com regras clássicas e variantes exclusivas da Tigrinho BET.
                </p>
                <Link
                  href="/login"
                  className="block bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black text-center py-3 rounded-lg font-medium transition-all"
                >
                  Jogar Agora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-yellow-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/tiger-pattern.png')] opacity-5 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-10 md:p-16 rounded-3xl border border-yellow-500/20 shadow-xl shadow-yellow-500/5 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para começar a ganhar?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Crie sua conta agora e receba um bônus de 100% no seu primeiro depósito até R$500.
            </p>
            <Link
              href="/register"
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-10 py-4 rounded-xl text-lg font-bold transition-all hover:shadow-lg hover:shadow-yellow-500/30"
            >
              Criar Minha Conta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md border-t border-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="text-2xl font-extrabold flex items-center mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Tigrinho</span>
                <span className="ml-2 bg-yellow-500 px-2 py-1 rounded text-black">BET</span>
              </div>
              <p className="text-gray-400">
                A melhor plataforma de apostas esportivas e jogos de cassino online do Brasil.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Apostas Esportivas</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Cassino ao Vivo</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Slots</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Promoções</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Chat ao Vivo</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">E-mail</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Jogo Responsável</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Licença</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 pt-8 text-center">
            <p className="text-gray-400">
              © 2023 Tigrinho BET. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Jogue com responsabilidade. Proibido para menores de 18 anos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
