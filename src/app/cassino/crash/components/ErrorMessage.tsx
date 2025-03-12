interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 flex items-center">
            <div className="w-10 h-10 min-w-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-500">!</span>
            </div>
            <p>{message}</p>
        </div>
    );
} 