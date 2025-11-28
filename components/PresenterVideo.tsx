'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useVideoContext } from './VideoContext';

type VideoPosition = 'tr' | 'br' | 'bl' | 'tl' | 'center';

interface PresenterVideoProps {
    src: string;
    id: string;
    position?: VideoPosition;
}

const positionClasses: Record<VideoPosition, string> = {
    tr: 'top-8 right-8',
    br: 'bottom-8 right-8',
    bl: 'bottom-8 left-8',
    tl: 'top-8 left-8',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

export const PresenterVideo: React.FC<PresenterVideoProps> = ({ src, id, position = 'br' }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { playingVideoId, setPlayingVideoId } = useVideoContext();
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Effect to pause this video if another video starts playing
    useEffect(() => {
        if (playingVideoId !== id && isPlaying) {
            if (videoRef.current) {
                videoRef.current.pause();
            }
            setIsPlaying(false);
        }
    }, [playingVideoId, id, isPlaying]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                // Stop any other playing video first
                setPlayingVideoId(id);
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
                setPlayingVideoId(null);
            }
        }
    };

    return (
        <div className={`absolute ${positionClasses[position]} w-48 h-48 bg-slate-900 rounded-full overflow-hidden shadow-2xl border-4 border-white/20 z-40 group transition-all hover:scale-105 print:hidden`}>
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                playsInline
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} />

            {/* Status Indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-lg z-50">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-gray-400'}`}></div>
                <span className="text-[10px] text-white font-bold tracking-widest">
                    {isPlaying ? 'LIVE' : 'PAUSED'}
                </span>
            </div>

            {/* Center Play/Pause Button */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <button
                    onClick={togglePlay}
                    className="p-4 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all transform hover:scale-110 border border-white/20 shadow-xl"
                >
                    {isPlaying ? <Pause size={32} fill="white" className="opacity-90" /> : <Play size={32} fill="white" className="ml-1 opacity-90" />}
                </button>
            </div>

            {/* Bottom Controls (Mute only) */}
            <div className={`absolute bottom-4 left-0 right-0 flex justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors border border-white/10"
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
            </div>
        </div>
    );
};
