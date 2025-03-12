export default function LoadingScreen() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-xl text-gray-300">Carregando...</div>
            </div>
        </div>
    );
} 