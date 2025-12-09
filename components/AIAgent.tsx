'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles, Rocket } from 'lucide-react';
import { TextTypeAnimation } from './TextTypeAnimation';
import type { RecommendResponse } from '@/app/api/recommend/route';

interface AIAgentProps {
    presentationId: string;
}

type AgentState = 'idle' | 'listening' | 'thinking' | 'responding' | 'error';

interface Message {
    id: string;
    type: 'user' | 'agent';
    text: string;
    recommendations?: RecommendResponse['recommendations'];
}

// Animation delay styles defined outside component for reference stability
const animationDelayStyles = {
    first: { animationDelay: '0ms' },
    second: { animationDelay: '150ms' },
    third: { animationDelay: '300ms' },
};

export function AIAgent({ presentationId }: AIAgentProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [state, setState] = useState<AgentState>('idle');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            type: 'agent',
            text: 'Hi! 👋 I\'m your AI guide. Tell me what kind of projects you\'re interested in, and I\'ll recommend the best matches from Wagner\'s portfolio.',
        }
    ]);
    const [input, setInput] = useState('');
    const [currentResponse, setCurrentResponse] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentResponse, scrollToBottom]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || state === 'thinking') return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: input,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setState('thinking');

        try {
            const response = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userInput: input }),
            });

            const data: RecommendResponse = await response.json();

            if (!response.ok) {
                // Handle rate limiting
                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After');
                    const errorMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        type: 'agent',
                        text: `I'm receiving too many requests right now. Please wait ${retryAfter || '60'} seconds before trying again. 🕐`,
                    };
                    setMessages(prev => [...prev, errorMessage]);
                    setState('idle');
                    return;
                }
                throw new Error(data.error || 'Failed to get recommendations');
            }

            setState('responding');

            // Build response message
            let responseText = data.message;
            if (data.recommendations.length > 0) {
                responseText += '\n\nHere are my top recommendations:';
            }

            const agentMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'agent',
                text: responseText,
                recommendations: data.recommendations,
            };

            setMessages(prev => [...prev, agentMessage]);
            setState('idle');
        } catch (error) {
            console.error('Agent error:', error);
            setState('error');

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'agent',
                text: 'Sorry, I encountered an error. Please try again or explore the projects manually.',
            };

            setMessages(prev => [...prev, errorMessage]);
            setTimeout(() => setState('idle'), 2000);
        }
    }, [input, state]);

    const handleProjectClick = useCallback((projectId: string) => {
        // Find the project slide element
        const projectElement = document.getElementById(`project-${projectId}`);
        if (projectElement) {
            projectElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close the agent after navigation
            setTimeout(() => setIsMinimized(true), 500);
        }
    }, []);

    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);
    const handleMinimize = useCallback(() => setIsMinimized(true), []);
    const handleMaximize = useCallback(() => setIsMinimized(false), []);
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value), []);

    if (!isOpen) {
        return (
            <button
                onClick={handleOpen}
                className="no-print fixed bottom-6 right-6 z-[60] bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                aria-label="Open AI Assistant"
                style={{
                    animation: 'sway 10s ease-in-out infinite',
                }}
            >
                <Bot className="w-6 h-6" style={{ animation: 'flip 10s ease-in-out infinite' }} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes sway {
                            0% { transform: translateX(0px); }
                            20% { transform: translateX(-50px); }
                            50% { transform: translateX(-50px); }
                            70% { transform: translateX(0px); }
                            100% { transform: translateX(0px); }
                        }
                        @keyframes flip {
                            0% { transform: scaleX(-1); }
                            19.9% { transform: scaleX(-1); }
                            20% { transform: scaleX(-1); }
                            49.9% { transform: scaleX(-1); }
                            50% { transform: scaleX(1); }
                            100% { transform: scaleX(1); }
                        }
                    `
                }} />
            </button>
        );
    }

    if (isMinimized) {
        return (
            <button
                onClick={handleMaximize}
                className="no-print fixed bottom-6 right-6 z-[60] bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">AI Assistant</span>
                {state === 'thinking' && (
                    <Sparkles className="w-4 h-4 animate-pulse" />
                )}
            </button>
        );
    }

    return (
        <div className="no-print fixed bottom-6 right-6 z-[60] w-96 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Bot className="w-6 h-6" />
                        {state === 'thinking' && (
                            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-pulse" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold">AI Project Guide</h3>
                        <p className="text-xs opacity-90">
                            {state === 'thinking' ? 'Analyzing...' : 'Ready to help'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleMinimize}
                        className="hover:bg-white/20 p-1 rounded transition-colors"
                        aria-label="Minimize"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                    <button
                        onClick={handleClose}
                        className="hover:bg-white/20 p-1 rounded transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, idx) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl p-3 ${msg.type === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                                }`}
                        >
                            {msg.type === 'agent' && idx === messages.length - 1 && state === 'responding' ? (
                                <TextTypeAnimation
                                    text={msg.text}
                                    speed={20}
                                    className="text-sm whitespace-pre-line"
                                />
                            ) : (
                                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                            )}

                            {/* Recommendations */}
                            {msg.recommendations && msg.recommendations.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {msg.recommendations.map((rec, recIdx) => (
                                        <button
                                            key={rec.projectId}
                                            onClick={() => handleProjectClick(rec.projectId)}
                                            className="w-full text-left bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 rounded-lg p-3 transition-all duration-200 hover:shadow-md group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                                            #{recIdx + 1}
                                                        </span>
                                                        <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {rec.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-1">{rec.subtitle}</p>
                                                    <p className="text-xs text-gray-700 italic">{rec.reason}</p>
                                                </div>
                                                <div className="flex-shrink-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    {rec.relevanceScore}%
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {state === 'thinking' && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-2xl p-3 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={animationDelayStyles.first}></span>
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={animationDelayStyles.second}></span>
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={animationDelayStyles.third}></span>
                                </div>
                                <span className="text-xs text-gray-600">Analyzing your request...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="E.g., 'AI projects' or 'cloud architecture'..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={state === 'thinking'}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || state === 'thinking'}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
