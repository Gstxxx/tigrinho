import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Tigrinho <span className="text-yellow-500">BET</span>
        </h1>
        
        <div className="bg-white/5 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Bem-vindo à Tigrinho BET</h2>
          <p className="text-lg mb-4">
            A melhor plataforma de apostas esportivas online. Aposte nos seus esportes favoritos e ganhe prêmios incríveis!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link 
              href="/login" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="bg-transparent hover:bg-white/10 border border-yellow-500 text-yellow-500 font-bold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Criar Conta
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Apostas Esportivas</h3>
            <p>Aposte em futebol, basquete, tênis e muito mais. Oferecemos as melhores odds do mercado!</p>
          </div>
          <div className="bg-white/5 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Bônus de Boas-vindas</h3>
            <p>Ganhe um bônus de 100% no seu primeiro depósito. Comece a apostar com o dobro do valor!</p>
          </div>
          <div className="bg-white/5 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Apostas ao Vivo</h3>
            <p>Acompanhe os jogos em tempo real e faça suas apostas durante as partidas!</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Esportes Populares</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Futebol', 'Basquete', 'Tênis', 'Vôlei', 'MMA', 'Boxe'].map((sport) => (
              <div key={sport} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-lg cursor-pointer transition-colors">
                {sport}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
