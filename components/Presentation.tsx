'use client';

import React from 'react';
import { Captions, CaptionsOff } from 'lucide-react';
import type { PresentationData } from '@/lib/types';
import { Slide } from './Slide';
import { VideoProvider, useVideoContext } from './VideoContext';
import { SubtitleDisplay } from './SubtitleDisplay';

interface PresentationProps {
    data: PresentationData;
}

const PresentationControls: React.FC = () => {
    const { subtitlesEnabled, setSubtitlesEnabled } = useVideoContext();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed top-4 right-4 z-50 no-print flex gap-2">
            <button
                onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                className={`${subtitlesEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-600'} text-white font-bold py-2 px-3 rounded shadow-lg transition-colors flex items-center gap-2`}
                title={subtitlesEnabled ? 'Disable subtitles' : 'Enable subtitles'}
            >
                {subtitlesEnabled ? <Captions size={20} /> : <CaptionsOff size={20} />}
            </button>
            <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors"
            >
                Export PDF
            </button>
        </div>
    );
};

export const Presentation: React.FC<PresentationProps> = ({ data }) => {
    return (
        <VideoProvider>
            <div className="min-h-screen bg-gray-100">
                <PresentationControls />
                <SubtitleDisplay />

                <div className="print:w-full print:h-full">
                    {data.slides.map((slide, index) => (
                        <Slide key={slide.id} slide={slide} slideNumber={index + 1} totalSlides={data.slides.length} presentationId={data.id} />
                    ))}
                </div>
            </div>
        </VideoProvider>
    );
};
