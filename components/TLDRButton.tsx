'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import { TLDRModal } from './TLDRModal';
import type { TLDRRequest, TLDRResponse, AudienceLevel } from '@/lib/ai/types';
import type { SlideData } from '@/lib/types';
import { trackTLDRClick, trackTLDRSuccess, trackTLDRError } from '@/lib/analytics';

interface TLDRButtonProps {
    slide: SlideData;
    isFirstProject?: boolean;
}

export const TLDRButton: React.FC<TLDRButtonProps> = ({ slide, isFirstProject = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState<string | undefined>();
    const [paintingUrl, setPaintingUrl] = useState<string | null>(null);
    const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
    const [oneSentence, setOneSentence] = useState<string>('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipDismissed, setTooltipDismissed] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const dismissTooltip = React.useCallback(() => {
        setShowTooltip(false);
        setTooltipDismissed(true);
    }, []);

    const handleClick = React.useCallback(() => {
        dismissTooltip();
        setIsModalOpen(true);
        // Reset all state when opening
        setError(undefined);
        setSummary('');
        setPaintingUrl(null);
        setVoiceUrl(null);
        setOneSentence('');
        setIsLoading(false);

        // Track TL;DR button click
        trackTLDRClick(slide.title);
    }, [dismissTooltip, slide.title]);

    const handleClose = React.useCallback(() => {
        setIsModalOpen(false);
        // Stop any playing speech
        window.speechSynthesis.cancel();
    }, []);

    // Show tooltip after 1s if first project and visible
    useEffect(() => {
        if (!isFirstProject || tooltipDismissed) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const timer = setTimeout(() => {
                            setShowTooltip(true);
                        }, 1000);
                        return () => clearTimeout(timer);
                    } else {
                        setShowTooltip(false);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (buttonRef.current) {
            observer.observe(buttonRef.current);
        }

        return () => observer.disconnect();
    }, [isFirstProject, tooltipDismissed]);

    const handleAudienceSelect = React.useCallback(async (level: AudienceLevel) => {
        setIsLoading(true);
        setError(undefined);
        setSummary('');

        try {
            // Fetch transcript from URL if provided
            let transcriptContent = slide.videoTranscript || '';
            if (slide.videoTranscriptUrl && !transcriptContent) {
                try {
                    const res = await fetch(slide.videoTranscriptUrl);
                    if (res.ok) {
                        transcriptContent = await res.text();
                    }
                } catch (e) {
                    console.error('Failed to fetch transcript:', e);
                }
            }

            const request: TLDRRequest = {
                projectTitle: slide.title,
                projectSubtitle: slide.subtitle || '',
                context: slide.context,
                challenge: slide.challenge || [],
                solution: slide.solution || [],
                impact: slide.impact || [],
                techs: slide.techs || [],
                videoTranscript: transcriptContent,
                audienceLevel: level,
            };

            const response = await fetch('/api/tldr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            const data: TLDRResponse = await response.json();

            if (data.error) {
                setError(data.error);
                trackTLDRError(slide.title, data.error);
            } else {
                setSummary(data.summary);
                trackTLDRSuccess(slide.title);
            }
        } catch (err) {
            const errorMsg = 'Failed to connect to AI service. Please try again.';
            setError(errorMsg);
            trackTLDRError(slide.title, errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [slide]);

    const handlePaintingGenerate = React.useCallback(async () => {
        setIsLoading(true);
        setError(undefined);
        setPaintingUrl(null);

        try {
            // Fetch transcript from URL if provided
            let transcriptContent = slide.videoTranscript || '';
            if (slide.videoTranscriptUrl && !transcriptContent) {
                try {
                    const res = await fetch(slide.videoTranscriptUrl);
                    if (res.ok) {
                        transcriptContent = await res.text();
                    }
                } catch (e) {
                    console.error('Failed to fetch transcript:', e);
                }
            }

            const request = {
                projectTitle: slide.title,
                projectSubtitle: slide.subtitle || '',
                challenge: slide.challenge || [],
                solution: slide.solution || [],
                techs: slide.techs || [],
            };

            const response = await fetch('/api/generate-painting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                trackTLDRError(slide.title, data.error);
            } else {
                setPaintingUrl(data.imageUrl);
                trackTLDRSuccess(slide.title);
            }
        } catch (err) {
            const errorMsg = 'Failed to generate painting. Please try again.';
            setError(errorMsg);
            trackTLDRError(slide.title, errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [slide]);

    const handleVoiceGenerate = React.useCallback(async () => {
        setIsLoading(true);
        setError(undefined);
        setVoiceUrl(null);
        setOneSentence('');

        try {
            const request = {
                projectTitle: slide.title,
                projectSubtitle: slide.subtitle || '',
                challenge: slide.challenge || [],
                solution: slide.solution || [],
                impact: slide.impact || [],
                techs: slide.techs || [],
            };

            const response = await fetch('/api/generate-voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            const data = await response.json();

            if (data.error || !response.ok) {
                const errorMessage = data.error || 'Failed to generate voice';
                setError(errorMessage);
                trackTLDRError(slide.title, errorMessage);
            } else {
                setOneSentence(data.oneSentence);
                if (data.audioUrl) {
                    setVoiceUrl(data.audioUrl);
                } else {
                    // Use Web Speech API fallback
                    const speakText = () => {
                        const utterance = new SpeechSynthesisUtterance(data.oneSentence);
                        utterance.rate = 0.8;  // Slower for robotic effect
                        utterance.pitch = 0.5; // Lower pitch
                        utterance.volume = 1.0;

                        // Try to find a robotic-sounding voice
                        const voices = window.speechSynthesis.getVoices();
                        const roboticVoice = voices.find(v =>
                            v.name.includes('Daniel') ||
                            v.name.includes('Google UK English Male') ||
                            v.name.includes('Microsoft David')
                        ) || voices[0];

                        if (roboticVoice) {
                            utterance.voice = roboticVoice;
                        }

                        window.speechSynthesis.speak(utterance);
                    };

                    // Voices might not be loaded yet, wait for them
                    if (window.speechSynthesis.getVoices().length > 0) {
                        speakText();
                    } else {
                        window.speechSynthesis.onvoiceschanged = () => {
                            speakText();
                        };
                    }
                }
                trackTLDRSuccess(slide.title);
            }
        } catch (err) {
            const errorMsg = 'Failed to generate voice. Please try again.';
            setError(errorMsg);
            trackTLDRError(slide.title, errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [slide]);

    return (
        <>
            <div className="relative">
                <button
                    ref={buttonRef}
                    onClick={handleClick}
                    className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-medium rounded-md shadow hover:shadow-lg transition-all transform hover:scale-105 print:hidden"
                    title="Generate AI Summary"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>TL;DR</span>
                </button>

                {/* Tooltip for first project */}
                {showTooltip && (
                    <div className="absolute top-full left-0 mt-2 z-50 animate-fade-in print:hidden">
                        <div className="relative bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl max-w-xs">
                            <div className="absolute -top-2 left-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-900" />
                            <button
                                onClick={dismissTooltip}
                                className="absolute top-1 right-1 p-1 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <p className="pr-4">Click here for an AI-generated description of this project</p>
                        </div>
                    </div>
                )}
            </div>

            <TLDRModal
                isOpen={isModalOpen}
                onClose={handleClose}
                summary={summary}
                isLoading={isLoading}
                error={error}
                projectTitle={slide.title}
                paintingUrl={paintingUrl}
                voiceUrl={voiceUrl}
                oneSentence={oneSentence}
                onAudienceSelect={handleAudienceSelect}
                onPaintingGenerate={handlePaintingGenerate}
                onVoiceGenerate={handleVoiceGenerate}
            />
        </>
    );
};
