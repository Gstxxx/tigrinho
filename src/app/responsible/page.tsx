'use client';

import Link from 'next/link';
import { FaArrowLeft, FaShieldAlt, FaRegClock, FaMoneyBillWave, FaRegLifeRing } from 'react-icons/fa';

export default function ResponsibleGaming() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors">
                        <FaArrowLeft className="mr-2" />
                        Voltar para a página inicial
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 p-8">
                    <h1 className="text-3xl font-bold mb-6">Jogo Responsável</h1>

                    <div className="space-y-8 text-gray-300">
                        <p className="text-lg">
                            Na Tigrinho BET, acreditamos que jogar deve ser uma experiência divertida e entretenimento. Estamos comprometidos em promover o jogo responsável e fornecer ferramentas para ajudar nossos usuários a manterem o controle.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <div className="flex items-center mb-4">
                                    <FaShieldAlt className="text-yellow-500 text-2xl mr-3" />
                                    <h2 className="text-xl font-semibold">Jogue com Segurança</h2>
                                </div>
                                <p>
                                    Estabeleça limites claros antes de começar a jogar. Decida quanto tempo e dinheiro você está disposto a gastar e mantenha-se fiel a esses limites.
                                </p>
                            </div>

                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <div className="flex items-center mb-4">
                                    <FaRegClock className="text-yellow-500 text-2xl mr-3" />
                                    <h2 className="text-xl font-semibold">Controle de Tempo</h2>
                                </div>
                                <p>
                                    Faça pausas regulares durante o jogo. Defina alarmes para lembrá-lo de quanto tempo você está jogando e quando é hora de parar.
                                </p>
                            </div>

                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <div className="flex items-center mb-4">
                                    <FaMoneyBillWave className="text-yellow-500 text-2xl mr-3" />
                                    <h2 className="text-xl font-semibold">Limites Financeiros</h2>
                                </div>
                                <p>
                                    Nunca jogue com dinheiro que você não pode perder. Estabeleça limites de depósito diários, semanais ou mensais para controlar seus gastos.
                                </p>
                            </div>

                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <div className="flex items-center mb-4">
                                    <FaRegLifeRing className="text-yellow-500 text-2xl mr-3" />
                                    <h2 className="text-xl font-semibold">Busque Ajuda</h2>
                                </div>
                                <p>
                                    Se você sentir que está perdendo o controle, não hesite em buscar ajuda. Existem organizações especializadas em apoiar pessoas com problemas de jogo.
                                </p>
                            </div>
                        </div>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-yellow-500">Nossas Ferramentas de Jogo Responsável</h2>
                            <div className="space-y-4">
                                <div className="bg-gray-800/30 p-4 rounded-xl">
                                    <h3 className="font-medium mb-2">Limites de Depósito</h3>
                                    <p>Defina limites para controlar quanto você pode depositar diariamente, semanalmente ou mensalmente.</p>
                                </div>

                                <div className="bg-gray-800/30 p-4 rounded-xl">
                                    <h3 className="font-medium mb-2">Auto-Exclusão</h3>
                                    <p>Se você precisar de uma pausa, pode optar por se auto-excluir temporariamente ou permanentemente da nossa plataforma.</p>
                                </div>

                                <div className="bg-gray-800/30 p-4 rounded-xl">
                                    <h3 className="font-medium mb-2">Lembretes de Tempo</h3>
                                    <p>Receba notificações sobre quanto tempo você está jogando para ajudá-lo a manter o controle.</p>
                                </div>

                                <div className="bg-gray-800/30 p-4 rounded-xl">
                                    <h3 className="font-medium mb-2">Histórico de Conta</h3>
                                    <p>Acesse facilmente seu histórico de apostas e transações para monitorar seus hábitos de jogo.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-yellow-500">Sinais de Alerta</h2>
                            <p className="mb-3">Fique atento a estes sinais que podem indicar um problema com jogos:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Jogar para escapar de problemas ou aliviar sentimentos negativos</li>
                                <li>Mentir para amigos ou familiares sobre quanto você joga</li>
                                <li>Gastar mais do que pode para recuperar perdas</li>
                                <li>Negligenciar responsabilidades devido ao jogo</li>
                                <li>Sentir irritabilidade quando tenta reduzir ou parar de jogar</li>
                                <li>Pedir dinheiro emprestado para jogar ou pagar dívidas de jogo</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-yellow-500">Recursos de Ajuda</h2>
                            <p className="mb-3">Se você ou alguém que você conhece está enfrentando problemas com jogos, entre em contato com estas organizações:</p>
                            <div className="space-y-3">
                                <div className="bg-gray-800/30 p-4 rounded-xl">
                                    <h3 className="font-medium">Jogadores Anônimos Brasil</h3>
                                    <p className="text-gray-400">Telefone: 0800-123-4567</p>
                                    <p className="text-gray-400">Site: www.jogadoresanonimos.org.br</p>
                                </div>

                                <div className="bg-gray-800/30 p-4 rounded-xl">
                                    <h3 className="font-medium">Centro de Apoio ao Jogador</h3>
                                    <p className="text-gray-400">Telefone: 0800-987-6543</p>
                                    <p className="text-gray-400">Email: ajuda@centrojogoresponsavel.org</p>
                                </div>
                            </div>
                        </section>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                            <h2 className="text-xl font-semibold mb-3">Nosso Compromisso</h2>
                            <p>
                                A Tigrinho BET está comprometida em fornecer um ambiente de jogo seguro e responsável. Se você tiver alguma dúvida ou precisar de assistência, nossa equipe de suporte está disponível 24/7 para ajudar.
                            </p>
                            <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition-colors">
                                Fale com o Suporte
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>© 2023 Tigrinho BET. Todos os direitos reservados.</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <Link href="/terms" className="hover:text-yellow-500 transition-colors">Termos</Link>
                        <Link href="/privacy" className="hover:text-yellow-500 transition-colors">Privacidade</Link>
                        <Link href="/responsible" className="hover:text-yellow-500 transition-colors">Jogo Responsável</Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 