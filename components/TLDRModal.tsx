'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles, Lightbulb, FileText, Video, Cpu, ArrowRight, User, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { AudienceLevel } from '@/lib/ai/types';

interface TLDRModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: string;
    isLoading: boolean;
    error?: string;
    projectTitle: string;
    onAudienceSelect?: (level: AudienceLevel) => void;
}

export const TLDRModal: React.FC<TLDRModalProps> = ({
    isOpen,
    onClose,
    summary,
    isLoading,
    error,
    projectTitle,
    onAudienceSelect
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'how-it-works'>('summary');
    const [selectedAudience, setSelectedAudience] = useState<AudienceLevel | null>(null);

    // Determine if we should show audience selection
    const showAudienceSelection = !selectedAudience && !isLoading && !summary && !error;

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

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab('summary');
            setSelectedAudience(null);
        }
    }, [isOpen]);

    const handleAudienceClick = (level: AudienceLevel) => {
        setSelectedAudience(level);
        onAudienceSelect?.(level);
    };

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

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                            activeTab === 'summary'
                                ? 'text-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Summary
                        </span>
                        {activeTab === 'summary' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('how-it-works')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                            activeTab === 'how-it-works'
                                ? 'text-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            How does this work?
                        </span>
                        {activeTab === 'how-it-works' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                        )}
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="px-6 py-5 overflow-y-auto max-h-[calc(80vh-200px)] scrollbar-thin">
                    {activeTab === 'summary' && (
                        <>
                            {/* Audience Selection */}
                            {showAudienceSelection && (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Explain this like I&apos;m...</h4>
                                    <p className="text-sm text-gray-500 mb-6">Choose your preferred level of detail</p>

                                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                        {/* Non-technical option */}
                                        <button
                                            onClick={() => handleAudienceClick('non-technical')}
                                            className="group flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all"
                                        >
                                            <div className="p-3 bg-blue-100 group-hover:bg-blue-200 rounded-full transition-colors">
                                                <User className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-gray-900">Not a tech person</p>
                                                <p className="text-xs text-gray-500 mt-1">Plain language, no jargon</p>
                                            </div>
                                        </button>

                                        {/* Technical option */}
                                        <button
                                            onClick={() => handleAudienceClick('technical')}
                                            className="group flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl transition-all"
                                        >
                                            <div className="p-3 bg-purple-100 group-hover:bg-purple-200 rounded-full transition-colors">
                                                <Code2 className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-gray-900">Love the details</p>
                                                <p className="text-xs text-gray-500 mt-1">Architecture & tech stack</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

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
                                <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-2 prose-ul:my-2 prose-li:text-gray-700 prose-strong:text-gray-900 prose-hr:my-4 prose-hr:border-gray-200">
                                    <ReactMarkdown>
                                        {summary}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'how-it-works' && (
                        <div className="space-y-6">
                            {/* Built by me badge */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                                <span className="text-2xl">🛠️</span>
                                <p className="text-sm font-medium text-gray-700">
                                    I built this feature to showcase how I approach AI integration in real products.
                                </p>
                            </div>

                            {/* How it works explanation */}
                            <div>
                                <h4 className="text-base font-semibold text-gray-900 mb-4">The Architecture</h4>

                                {/* Flow diagram */}
                                <div className="flex flex-col gap-3">
                                    {/* Step 1 */}
                                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">1. Project Data</p>
                                            <p className="text-sm text-gray-600">
                                                Each project has structured data: context, challenges, solutions, impact metrics, and tech stack. This is the foundation.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                        <div className="p-2 bg-green-100 rounded-lg shrink-0">
                                            <Video className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">2. Video Transcription</p>
                                            <p className="text-sm text-gray-600">
                                                I recorded video explanations for each project. The transcripts add personal context and nuances that structured data can&apos;t capture.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                        <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                                            <Cpu className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">3. AI Processing</p>
                                            <p className="text-sm text-gray-600">
                                                Gemini 2.5 Flash receives both data sources with a crafted prompt. It synthesizes a concise summary that captures the essence of each project.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                                    </div>

                                    {/* Step 4 */}
                                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                                        <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                                            <Sparkles className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">4. Real-time Generation</p>
                                            <p className="text-sm text-gray-600">
                                                Summaries are generated on-demand via a Next.js API route. I could cache responses since inputs are static per project, but I intentionally generate fresh summaries each time — demonstrating real AI integration, not just serving stored text.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Why this matters */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h5 className="font-medium text-gray-900 mb-2">Why I built this</h5>
                                <p className="text-sm text-gray-600">
                                    This feature demonstrates my approach to AI integration: combining structured data with unstructured content (video transcripts) to create genuinely useful outputs. It&apos;s not just a gimmick — it solves a real UX problem of helping busy reviewers quickly understand complex projects.
                                </p>
                            </div>

                            {/* Tech stack */}
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">Next.js API Routes</span>
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">Gemini 2.5 Flash</span>
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">TypeScript</span>
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">Prompt Engineering</span>
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">Video Transcription</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isLoading && !showAudienceSelection && (
                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {activeTab === 'summary'
                                ? `Generated by AI · ${selectedAudience === 'technical' ? 'Technical details' : 'Plain language'}`
                                : 'Built by Wagner Silva'}
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
