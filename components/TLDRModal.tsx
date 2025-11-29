'use client';

import React, { useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';

interface TLDRModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: string;
    isLoading: boolean;
    error?: string;
    projectTitle: string;
}

export const TLDRModal: React.FC<TLDRModalProps> = ({
    isOpen,
    onClose,
    summary,
    isLoading,
    error,
    projectTitle
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Close on outside click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">AI TL;DR</h3>
                            <p className="text-sm text-gray-500 truncate max-w-md">{projectTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="px-6 py-5 overflow-y-auto max-h-[calc(80vh-140px)] scrollbar-thin">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600" />
                                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-purple-600" />
                            </div>
                            <p className="mt-4 text-gray-600 font-medium">Generating summary...</p>
                            <p className="text-sm text-gray-400">Powered by Gemini 2.5 Flash</p>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="p-3 bg-red-100 rounded-full mb-4">
                                <X className="w-6 h-6 text-red-600" />
                            </div>
                            <p className="text-red-600 font-medium">{error}</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}

                    {summary && !isLoading && !error && (
                        <div className="prose prose-sm max-w-none">
                            {summary.split('\n').map((line, index) => {
                                // Handle bold headers like **The Challenge**
                                if (line.match(/^\*\*[^*]+\*\*$/)) {
                                    const title = line.replace(/\*\*/g, '');
                                    return (
                                        <h4 key={index} className="text-base font-semibold text-gray-900 mt-5 mb-2 first:mt-0 border-b border-gray-200 pb-1">
                                            {title}
                                        </h4>
                                    );
                                }
                                // Handle empty lines
                                if (line.trim() === '') {
                                    return <div key={index} className="h-2" />;
                                }
                                // Regular paragraph
                                return (
                                    <p key={index} className="text-gray-700 leading-relaxed mb-2">
                                        {line}
                                    </p>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isLoading && (
                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Generated by AI based on project data
                        </span>
                        <button
                            onClick={onClose}
                            className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
