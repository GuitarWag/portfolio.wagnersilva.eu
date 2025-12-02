'use client';

import React, { createContext, useContext, useState } from 'react';

interface VideoContextType {
    playingVideoId: string | null;
    setPlayingVideoId: (id: string | null) => void;
    currentSubtitle: string;
    setCurrentSubtitle: (text: string) => void;
    subtitlesEnabled: boolean;
    setSubtitlesEnabled: (enabled: boolean) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
    const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(true);

    const value = React.useMemo(() => ({
        playingVideoId,
        setPlayingVideoId,
        currentSubtitle,
        setCurrentSubtitle,
        subtitlesEnabled,
        setSubtitlesEnabled
    }), [playingVideoId, currentSubtitle, subtitlesEnabled]);

    return (
        <VideoContext.Provider value={value}>
            {children}
        </VideoContext.Provider>
    );
}

export function useVideoContext() {
    const context = useContext(VideoContext);
    if (context === undefined) {
        throw new Error('useVideoContext must be used within a VideoProvider');
    }
    return context;
}
