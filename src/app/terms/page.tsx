'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function TermsOfService() {
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
                    <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>

                    <div className="space-y-6 text-gray-300">
                        <p>
                            Última atualização: {new Date().toLocaleDateString('pt-BR')}
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">1. Aceitação dos Termos</h2>
                            <p>
                                Ao acessar ou usar a plataforma Tigrinho BET, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">2. Elegibilidade</h2>
                            <p>
                                Para usar nossos serviços, você deve:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Ter pelo menos 18 anos de idade</li>
                                <li>Residir em uma jurisdição onde o jogo online é legal</li>
                                <li>Usar a plataforma apenas para fins pessoais e não comerciais</li>
                                <li>Não estar proibido de participar em jogos de azar por qualquer motivo</li>
                            </ul>
                            <p className="mt-2">
                                Reservamo-nos o direito de verificar sua idade e identidade a qualquer momento.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">3. Contas de Usuário</h2>
                            <p>
                                Ao criar uma conta, você concorda em:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Fornecer informações precisas, atuais e completas</li>
                                <li>Manter a confidencialidade de sua senha e informações da conta</li>
                                <li>Ser o único responsável por todas as atividades que ocorrem em sua conta</li>
                                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
                            </ul>
                            <p className="mt-2">
                                Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">4. Depósitos e Saques</h2>
                            <p>
                                Ao realizar transações financeiras em nossa plataforma:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Você garante que os fundos utilizados são de origem legal e pertencem a você</li>
                                <li>Depósitos e saques estão sujeitos a verificações de segurança e anti-fraude</li>
                                <li>Valores mínimos e máximos para depósitos e saques podem ser aplicados</li>
                                <li>Taxas de processamento podem ser aplicadas conforme indicado no momento da transação</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">5. Apostas e Jogos</h2>
                            <p>
                                Ao participar de jogos e apostas em nossa plataforma:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Você aceita que os resultados são determinados por geradores de números aleatórios certificados</li>
                                <li>Todas as apostas são finais e não podem ser canceladas após confirmação</li>
                                <li>Reservamo-nos o direito de cancelar apostas em caso de erro técnico ou mau funcionamento</li>
                                <li>Limites de apostas podem ser aplicados a critério da plataforma</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">6. Jogo Responsável</h2>
                            <p>
                                Promovemos o jogo responsável e oferecemos ferramentas para ajudá-lo a controlar suas atividades de jogo, incluindo:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Limites de depósito</li>
                                <li>Limites de tempo de jogo</li>
                                <li>Auto-exclusão temporária ou permanente</li>
                                <li>Acesso ao histórico de apostas e transações</li>
                            </ul>
                            <p className="mt-2">
                                Para mais informações, consulte nossa <Link href="/responsible" className="text-yellow-500 hover:underline">Política de Jogo Responsável</Link>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">7. Propriedade Intelectual</h2>
                            <p>
                                Todo o conteúdo disponível em nossa plataforma, incluindo mas não limitado a logotipos, textos, gráficos, imagens, vídeos, software e código, é propriedade da Tigrinho BET ou de seus licenciadores e é protegido por leis de propriedade intelectual.
                            </p>
                            <p className="mt-2">
                                Você não pode copiar, modificar, distribuir, vender ou alugar qualquer parte de nossos serviços sem nossa permissão expressa por escrito.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">8. Limitação de Responsabilidade</h2>
                            <p>
                                Na extensão máxima permitida por lei, a Tigrinho BET não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar nossos serviços.
                            </p>
                            <p className="mt-2">
                                Nossos serviços são fornecidos &ldquo;como estão&rdquo; e &ldquo;conforme disponíveis&rdquo;, sem garantias de qualquer tipo, expressas ou implícitas.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">9. Alterações nos Termos</h2>
                            <p>
                                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação dos termos atualizados em nossa plataforma.
                            </p>
                            <p className="mt-2">
                                O uso continuado de nossos serviços após tais alterações constitui sua aceitação dos novos termos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">10. Lei Aplicável</h2>
                            <p>
                                Estes Termos de Uso são regidos e interpretados de acordo com as leis do Brasil. Qualquer disputa decorrente destes termos será submetida à jurisdição exclusiva dos tribunais brasileiros.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">11. Contato</h2>
                            <p>
                                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail: legal@tigrinhobet.com
                            </p>
                        </section>
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