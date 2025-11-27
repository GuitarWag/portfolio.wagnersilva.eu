'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface VideoContextType {
    playingVideoId: string | null;
    setPlayingVideoId: (id: string | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    return (
        <VideoContext.Provider value={{ playingVideoId, setPlayingVideoId }}>
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
