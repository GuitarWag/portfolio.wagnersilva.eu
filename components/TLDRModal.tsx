'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles, Lightbulb, FileText, Video, Cpu, ArrowRight, User, Code2, Palette, Volume2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { AudienceLevel } from '@/lib/ai/types';

type CreativeMode = 'text' | 'painting' | 'voice';

interface TLDRModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: string;
    isLoading: boolean;
    error?: string;
    projectTitle: string;
    paintingUrl?: string | null;
    voiceUrl?: string | null;
    oneSentence?: string;
    onAudienceSelect?: (level: AudienceLevel) => void;
    onPaintingGenerate?: () => void;
    onVoiceGenerate?: () => void;
}

export const TLDRModal: React.FC<TLDRModalProps> = ({
    isOpen,
    onClose,
    summary,
    isLoading,
    error,
    projectTitle,
    paintingUrl: externalPaintingUrl,
    voiceUrl: externalVoiceUrl,
    oneSentence: externalOneSentence,
    onAudienceSelect,
    onPaintingGenerate,
    onVoiceGenerate
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'how-it-works'>('summary');
    const [selectedMode, setSelectedMode] = useState<CreativeMode | null>(null);
    const [selectedAudience, setSelectedAudience] = useState<AudienceLevel | null>(null);

    // Use external props passed from parent
    const paintingUrl = externalPaintingUrl;
    const voiceUrl = externalVoiceUrl;
    const oneSentence = externalOneSentence || '';

    // Determine if we should show mode selection
    const showModeSelection = !selectedMode && !isLoading && !summary && !error && !paintingUrl && !voiceUrl;

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
            setSelectedMode(null);
            setSelectedAudience(null);
        }
    }, [isOpen]);

    const handleModeClick = (mode: CreativeMode) => {
        setSelectedMode(mode);
        if (mode === 'text') {
            // Keep existing flow - will show audience selection next
        } else if (mode === 'painting') {
            // Call parent handler to generate painting
            onPaintingGenerate?.();
        } else if (mode === 'voice') {
            // Call parent handler to generate voice
            onVoiceGenerate?.();
        }
    };

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
                className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
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
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'summary'
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
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'how-it-works'
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
                <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin">
                    {activeTab === 'summary' && (
                        <>
                            {/* Creative Mode Selection */}
                            {showModeSelection && (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Explain this like I&apos;m...</h4>
                                    <p className="text-sm text-gray-500 mb-6">Choose how you want to experience this project</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                                        {/* Text Summary */}
                                        <button
                                            onClick={() => handleModeClick('text')}
                                            className="group flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all"
                                        >
                                            <div className="p-3 bg-blue-100 group-hover:bg-blue-200 rounded-full transition-colors">
                                                <Sparkles className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-gray-900">Reading</p>
                                                <p className="text-xs text-gray-500 mt-1">AI-generated summary</p>
                                            </div>
                                        </button>

                                        {/* Oil Painting */}
                                        <button
                                            onClick={() => handleModeClick('painting')}
                                            className="group flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-2 border-amber-200 hover:border-amber-400 rounded-xl transition-all"
                                        >
                                            <div className="p-3 bg-amber-100 group-hover:bg-amber-200 rounded-full transition-colors">
                                                <Palette className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-gray-900">Looking at art</p>
                                                <p className="text-xs text-gray-500 mt-1">1800s oil painting</p>
                                            </div>
                                        </button>

                                        {/* Robotic Voice */}
                                        <button
                                            onClick={() => handleModeClick('voice')}
                                            className="group flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl transition-all"
                                        >
                                            <div className="p-3 bg-purple-100 group-hover:bg-purple-200 rounded-full transition-colors">
                                                <Volume2 className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-gray-900">A robot</p>
                                                <p className="text-xs text-gray-500 mt-1">Robotic TTS voice</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Audience Selection (for text mode) */}
                            {selectedMode === 'text' && !selectedAudience && !isLoading && !summary && !error && (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">What&apos;s your background?</h4>
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

                            {summary && !isLoading && !error && selectedMode === 'text' && (
                                <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-2 prose-ul:my-2 prose-li:text-gray-700 prose-strong:text-gray-900 prose-hr:my-4 prose-hr:border-gray-200">
                                    <ReactMarkdown>
                                        {summary}
                                    </ReactMarkdown>
                                </div>
                            )}

                            {/* Oil Painting Display */}
                            {paintingUrl && selectedMode === 'painting' && !isLoading && (
                                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                                    <div className="relative w-full flex justify-center">
                                        <img
                                            src={paintingUrl}
                                            alt="Oil painting representation of the project"
                                            className="max-h-[calc(90vh-280px)] w-auto object-contain"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 italic text-center">
                                        An artistic interpretation of {projectTitle} as an 1800s oil painting
                                    </p>
                                </div>
                            )}

                            {/* Robotic Voice Display */}
                            {oneSentence && selectedMode === 'voice' && !isLoading && (
                                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                                    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl">
                                        <Volume2 className="w-24 h-24 text-purple-400 animate-pulse" />
                                    </div>
                                    <div className="max-w-2xl text-center">
                                        <p className="text-xl font-mono text-gray-700 mb-4">&quot;{oneSentence}&quot;</p>
                                        <p className="text-xs text-gray-400">- Robotic Voice Synthesis</p>
                                    </div>
                                    {voiceUrl && (
                                        <audio
                                            controls
                                            autoPlay
                                            className="w-full max-w-md"
                                        >
                                            <source src={voiceUrl} type="audio/flac" />
                                            <source src={voiceUrl} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    )}
                                    <p className="text-sm text-gray-500 italic text-center max-w-md">
                                        {voiceUrl ? 'Server-generated TTS audio' : 'Using browser text-to-speech'}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'how-it-works' && (
                        <div className="space-y-6">
                            {/* Built by me badge */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                                <span className="text-2xl">🎨</span>
                                <p className="text-sm font-medium text-gray-700">
                                    Multimodal AI showcase: Experience projects through text, art, or voice — demonstrating creative AI integration.
                                </p>
                            </div>

                            {/* Three Modes */}
                            <div>
                                <h4 className="text-base font-semibold text-gray-900 mb-4">Three Creative Modes</h4>

                                <div className="space-y-3">
                                    {/* Text Mode */}
                                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                                            <Sparkles className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">📝 Text Summary</p>
                                            <p className="text-sm text-gray-600 mb-2">
                                                AI-generated summaries tailored to your audience level (technical/non-technical).
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                <strong>Tech:</strong> Gemini 2.5 Flash + video transcripts + prompt engineering
                                            </p>
                                        </div>
                                    </div>

                                    {/* Painting Mode */}
                                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                                        <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                                            <Palette className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">🎨 Oil Painting</p>
                                            <p className="text-sm text-gray-600 mb-2">
                                                1800s-style oil paintings with gold frames. Modern tech imagined as Victorian-era art.
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                <strong>Tech:</strong> Gemini 2.5 Flash Image + artistic prompt engineering (no text, portrait 9:16, gold frame)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Voice Mode */}
                                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                        <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                                            <Volume2 className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">🤖 Robotic Voice</p>
                                            <p className="text-sm text-gray-600 mb-2">
                                                One-sentence robotic summary with local TTS. Stephen Hawking-style synthesis.
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                <strong>Tech:</strong> Gemini 2.5 Flash (summary) + Transformers.js (local TTS model) + WAV encoding
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Why this matters */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h5 className="font-medium text-gray-900 mb-2">Why Multimodal?</h5>
                                <p className="text-sm text-gray-600 mb-3">
                                    This showcases how different AI modalities can tell the same story in unique ways. It&apos;s about creative problem-solving and understanding that not everyone consumes information the same way.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• <strong>Text:</strong> Quick, scannable, audience-aware</li>
                                    <li>• <strong>Art:</strong> Emotional, memorable, visually striking</li>
                                    <li>• <strong>Voice:</strong> Accessible, hands-free, concise</li>
                                </ul>
                            </div>

                            {/* Tech stack */}
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Technologies Used</h5>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">Gemini 2.5 Flash</span>
                                    <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">Gemini 2.5 Flash Image</span>
                                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">Transformers.js</span>
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">Next.js API Routes</span>
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">TypeScript</span>
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">Web Speech API</span>
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">Rate Limiting</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isLoading && !showModeSelection && (
                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {activeTab === 'summary'
                                ? selectedMode === 'text' && selectedAudience
                                    ? `Generated by AI · ${selectedAudience === 'technical' ? 'Technical details' : 'Plain language'}`
                                    : selectedMode === 'painting'
                                        ? 'Generated by Imagen · 1800s oil painting style'
                                        : selectedMode === 'voice'
                                            ? 'Generated by TTS · Robotic voice synthesis'
                                            : 'AI-powered multimodal showcase'
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
