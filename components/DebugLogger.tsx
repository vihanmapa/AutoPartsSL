import React, { useState, useEffect } from 'react';
import { Terminal, X, Trash2 } from 'lucide-react';

export const DebugLogger: React.FC = () => {
    const [logs, setLogs] = useState<{ type: string; message: string; timestamp: string }[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        const addLog = (type: string, args: any[]) => {
            const message = args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');

            setLogs(prev => [...prev.slice(-49), {
                type,
                message,
                timestamp: new Date().toLocaleTimeString()
            }]);
        };

        console.log = (...args) => {
            originalLog(...args);
            addLog('log', args);
        };

        console.warn = (...args) => {
            originalWarn(...args);
            addLog('warn', args);
        };

        console.error = (...args) => {
            originalError(...args);
            addLog('error', args);
        };

        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, []);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-[100] bg-black/80 text-white p-3 rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition-colors"
                title="Open Debug Console"
            >
                <Terminal className="h-6 w-6" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 text-green-400 font-mono text-xs flex flex-col animate-in slide-in-from-bottom duration-200" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span className="font-bold">Debug Console</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setLogs([])} className="p-1 hover:text-white transition-colors" title="Clear Logs">
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:text-white transition-colors" title="Close">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-2">
                {logs.length === 0 && (
                    <div className="text-slate-600 italic text-center mt-10">No logs yet...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className={`border-b border-slate-800/50 pb-1 break-words ${log.type === 'error' ? 'text-red-400' :
                        log.type === 'warn' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                        <span className="opacity-50 mr-2">[{log.timestamp}]</span>
                        <span className="uppercase font-bold text-[10px] mr-1 tracking-wider">{log.type}:</span>
                        <span className="whitespace-pre-wrap">{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
