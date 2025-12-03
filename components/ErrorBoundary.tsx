import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
                    <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                    <p className="text-slate-400 mb-6">The application encountered a critical error.</p>
                    <div className="bg-slate-800 p-4 rounded-lg text-left w-full max-w-md overflow-auto max-h-64 mb-6">
                        <p className="text-red-400 font-mono text-xs whitespace-pre-wrap">
                            {this.state.error?.toString()}
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-secondary hover:bg-secondary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
