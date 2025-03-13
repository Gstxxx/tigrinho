'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function PrivacyPolicy() {
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
                    <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>

                    <div className="space-y-6 text-gray-300">
                        <p>
                            Última atualização: {new Date().toLocaleDateString('pt-BR')}
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">1. Introdução</h2>
                            <p>
                                A Tigrinho BET está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos, transferimos e armazenamos suas informações. Dedique alguns minutos para se familiarizar com nossas práticas de privacidade.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">2. Informações que Coletamos</h2>
                            <p>
                                Podemos coletar vários tipos de informações, incluindo:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Informações pessoais como nome, endereço de e-mail, data de nascimento e informações de pagamento</li>
                                <li>Informações sobre suas apostas e atividades de jogo</li>
                                <li>Informações técnicas como endereço IP, tipo de dispositivo e navegador</li>
                                <li>Informações de uso, incluindo páginas visitadas e tempo gasto no site</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">3. Como Usamos Suas Informações</h2>
                            <p>
                                Usamos suas informações para:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Fornecer, manter e melhorar nossos serviços</li>
                                <li>Processar transações e gerenciar sua conta</li>
                                <li>Verificar sua identidade e prevenir fraudes</li>
                                <li>Cumprir obrigações legais e regulatórias</li>
                                <li>Personalizar sua experiência e oferecer promoções relevantes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">4. Compartilhamento de Informações</h2>
                            <p>
                                Podemos compartilhar suas informações com:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Provedores de serviços que nos ajudam a operar nosso negócio</li>
                                <li>Autoridades reguladoras e órgãos governamentais, quando exigido por lei</li>
                                <li>Parceiros de negócios para oferecer serviços conjuntos</li>
                            </ul>
                            <p className="mt-2">
                                Não vendemos suas informações pessoais a terceiros.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">5. Segurança</h2>
                            <p>
                                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou alteração. Utilizamos criptografia, firewalls e outros controles de segurança para manter a integridade e confidencialidade de seus dados.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">6. Seus Direitos</h2>
                            <p>
                                Você tem direitos em relação às suas informações pessoais, incluindo:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Acessar e receber uma cópia de suas informações</li>
                                <li>Corrigir informações imprecisas</li>
                                <li>Solicitar a exclusão de suas informações</li>
                                <li>Retirar seu consentimento a qualquer momento</li>
                                <li>Apresentar uma reclamação a uma autoridade de proteção de dados</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">7. Alterações nesta Política</h2>
                            <p>
                                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas publicando a nova política em nosso site ou enviando uma notificação direta.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-yellow-500">8. Contato</h2>
                            <p>
                                Se você tiver dúvidas sobre esta Política de Privacidade ou nossas práticas de privacidade, entre em contato conosco pelo e-mail: privacy@tigrinhobet.com
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