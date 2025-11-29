'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import { TLDRModal } from './TLDRModal';
import type { TLDRRequest, TLDRResponse } from '@/lib/ai/types';
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
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipDismissed, setTooltipDismissed] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

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

    const dismissTooltip = () => {
        setShowTooltip(false);
        setTooltipDismissed(true);
    };

    const handleClick = async () => {
        dismissTooltip();
        setIsModalOpen(true);
        setIsLoading(true);
        setError(undefined);
        setSummary('');

        // Track TL;DR button click
        trackTLDRClick(slide.title);

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
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

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
            />
        </>
    );
};
