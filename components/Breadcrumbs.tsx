import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    active?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    onHomeClick: () => void;
    className?: string; // For extra styling
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onHomeClick, className = '' }) => {
    return (
        <nav className={`flex items-center text-sm text-slate-500 my-2 ${className}`} aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
                {/* Home Item */}
                <li className="inline-flex items-center">
                    <button
                        onClick={onHomeClick}
                        className="inline-flex items-center hover:text-slate-900 transition-colors"
                    >
                        <Home className="w-4 h-4 mr-1" />
                        Home
                    </button>
                </li>

                {/* Breadcrumb Items */}
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />
                            {item.active ? (
                                <span className="text-slate-900 font-medium truncate max-w-[200px]">
                                    {item.label}
                                </span>
                            ) : (
                                <button
                                    onClick={item.onClick}
                                    className={`text-slate-700 hover:text-slate-900 transition-colors ${!item.onClick ? 'pointer-events-none' : ''}`}
                                    disabled={!item.onClick}
                                >
                                    {item.label}
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};
