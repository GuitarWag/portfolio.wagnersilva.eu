'use client';

import React from 'react';
import { useVideoContext } from './VideoContext';

export const SubtitleDisplay: React.FC = () => {
    const { currentSubtitle, subtitlesEnabled } = useVideoContext();

    if (!subtitlesEnabled || !currentSubtitle) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-3xl px-6 print:hidden">
            <div className="bg-black/80 backdrop-blur-sm text-white text-xl font-medium px-6 py-3 rounded-lg text-center shadow-2xl">
                {currentSubtitle}
            </div>
        </div>
    );
};
