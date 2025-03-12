import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black/60 backdrop-blur-md border-t border-gray-800/50 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-500 text-sm">
                    © 2023 Tigrinho BET. Todos os direitos reservados.
                </p>
                <div className="flex justify-center gap-4 mt-2">
                    <Link href="/terms" className="text-gray-500 hover:text-yellow-500 text-sm transition-colors">Termos</Link>
                    <Link href="/privacy" className="text-gray-500 hover:text-yellow-500 text-sm transition-colors">Privacidade</Link>
                    <Link href="/responsible" className="text-gray-500 hover:text-yellow-500 text-sm transition-colors">Jogo Responsável</Link>
                </div>
            </div>
        </footer>
    );
} 