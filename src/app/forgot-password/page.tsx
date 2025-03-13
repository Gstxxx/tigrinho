'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaArrowRight, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('Por favor, informe seu e-mail');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Simulação de envio de e-mail de recuperação
            // Em um ambiente real, isso seria uma chamada à API
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess(true);
        } catch (err) {
            console.error('Erro ao solicitar recuperação de senha:', err);
            setError('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col justify-center">
            <div className="max-w-md mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/login" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors">
                        <FaArrowLeft className="mr-2" />
                        Voltar para o login
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/50 border border-gray-700/50 p-8">
                    {!success ? (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold">Recuperação de Senha</h1>
                                <p className="text-gray-400 mt-2">
                                    Informe seu e-mail para receber instruções de recuperação de senha
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                                        E-mail
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-500" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center">
                                        {loading ? 'Processando...' : (
                                            <>
                                                Enviar instruções
                                                <FaArrowRight className="ml-2" />
                                            </>
                                        )}
                                    </span>
                                    <span className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="flex justify-center mb-4">
                                <FaCheckCircle className="text-green-500 text-5xl" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">E-mail enviado!</h2>
                            <p className="text-gray-400 mb-6">
                                Enviamos instruções de recuperação de senha para <span className="text-white font-medium">{email}</span>. Por favor, verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                            </p>
                            <p className="text-gray-400 text-sm">
                                Não recebeu o e-mail? Verifique sua pasta de spam ou <button onClick={() => setSuccess(false)} className="text-yellow-500 hover:underline">tente novamente</button>.
                            </p>
                        </div>
                    )}
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