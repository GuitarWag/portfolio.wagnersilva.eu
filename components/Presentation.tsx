'use client';

import React, { useState } from 'react';
import { Captions, CaptionsOff, MoreVertical, FileDown } from 'lucide-react';
import type { PresentationData } from '@/lib/types';
import { Slide } from './Slide';
import { VideoProvider, useVideoContext } from './VideoContext';
import { SubtitleDisplay } from './SubtitleDisplay';
import { AIAgent } from './AIAgent';

interface PresentationProps {
    data: PresentationData;
}

const PresentationControls: React.FC = () => {
    const { subtitlesEnabled, setSubtitlesEnabled, playingVideoId } = useVideoContext();
    const [menuOpen, setMenuOpen] = useState(false);

    const handlePrint = React.useCallback(() => {
        window.print();
        setMenuOpen(false);
    }, []);

    const toggleSubtitles = React.useCallback(() => {
        setSubtitlesEnabled(!subtitlesEnabled);
    }, [subtitlesEnabled, setSubtitlesEnabled]);

    const toggleMenu = React.useCallback(() => {
        setMenuOpen(prev => !prev);
    }, []);

    const closeMenu = React.useCallback(() => {
        setMenuOpen(false);
    }, []);

    return (
        <div className="fixed top-4 right-4 z-50 no-print flex gap-2 items-start">
            {/* CC Button - only show when video is playing */}
            {playingVideoId && (
                <button
                    onClick={toggleSubtitles}
                    className={`${subtitlesEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-600'} text-white font-bold py-2 px-3 rounded shadow-lg transition-colors flex items-center gap-2`}
                    title={subtitlesEnabled ? 'Disable subtitles' : 'Enable subtitles'}
                >
                    {subtitlesEnabled ? <Captions size={20} /> : <CaptionsOff size={20} />}
                </button>
            )}

            {/* 3-dot menu */}
            <div className="relative">
                <button
                    onClick={toggleMenu}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold p-2 rounded shadow-lg transition-colors"
                    title="Menu"
                >
                    <MoreVertical size={20} />
                </button>

                {menuOpen && (
                    <>
                        {/* Backdrop to close menu */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={closeMenu}
                        />

                        {/* Dropdown menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                            <button
                                onClick={handlePrint}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                            >
                                <FileDown size={18} />
                                <span className="font-medium">Export PDF</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const Presentation: React.FC<PresentationProps> = ({ data }) => {
    return (
        <VideoProvider>
            <div className="min-h-screen bg-gray-100">
                <PresentationControls />
                <SubtitleDisplay />
                <AIAgent presentationId={data.id} />

                <div className="print:w-full print:h-full">
                    {data.slides.map((slide, index) => (
                        <Slide key={slide.id} slide={slide} slideNumber={index + 1} totalSlides={data.slides.length} presentationId={data.id} />
                    ))}
                </div>
            </div>
        </VideoProvider>
    );
};
