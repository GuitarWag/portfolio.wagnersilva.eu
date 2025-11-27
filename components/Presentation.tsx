'use client';

import React from 'react';
import type { PresentationData } from '@/lib/types';
import { Slide } from './Slide';
import { VideoProvider } from './VideoContext';

interface PresentationProps {
    data: PresentationData;
}

export const Presentation: React.FC<PresentationProps> = ({ data }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <VideoProvider>
            <div className="min-h-screen bg-gray-100">
                <div className="fixed top-4 right-4 z-50 no-print flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors"
                    >
                        Export PDF
                    </button>
                </div>

                <div className="print:w-full print:h-full">
                    {data.slides.map((slide, index) => (
                        <Slide key={slide.id} slide={slide} slideNumber={index + 1} totalSlides={data.slides.length} />
                    ))}
                </div>
            </div>
        </VideoProvider>
    );
};
