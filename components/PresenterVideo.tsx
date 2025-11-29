'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useVideoContext } from './VideoContext';
import { trackVideoPlay, trackVideoPause } from '@/lib/analytics';

type VideoPosition = 'tr' | 'br' | 'bl' | 'tl' | 'center';

interface Cue {
    start: number;
    end: number;
    text: string;
}

interface PresenterVideoProps {
    src: string;
    id: string;
    position?: VideoPosition;
    subtitles?: string;
    onEnded?: () => void;
    projectTitle?: string;
    posterTime?: number; // Time in seconds to show as poster frame
}

const positionClasses: Record<VideoPosition, string> = {
    tr: 'top-8 right-8',
    br: 'bottom-8 right-8',
    bl: 'bottom-8 left-8',
    tl: 'top-8 left-8',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

// Parse VTT timestamp to seconds
function parseTimestamp(timestamp: string): number {
    const parts = timestamp.split(':');
    if (parts.length === 3) {
        const [hours, minutes, rest] = parts;
        const [seconds, ms] = rest.split('.');
        return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + parseInt(ms || '0') / 1000;
    } else if (parts.length === 2) {
        const [minutes, rest] = parts;
        const [seconds, ms] = rest.split('.');
        return parseInt(minutes) * 60 + parseInt(seconds) + parseInt(ms || '0') / 1000;
    }
    return 0;
}

// Parse VTT content into cues
function parseVTT(content: string): Cue[] {
    const cues: Cue[] = [];
    const lines = content.split('\n');
    let i = 0;

    // Skip WEBVTT header
    while (i < lines.length && !lines[i].includes('-->')) {
        i++;
    }

    while (i < lines.length) {
        const line = lines[i].trim();
        if (line.includes('-->')) {
            const [startStr, endStr] = line.split('-->').map(s => s.trim());
            const start = parseTimestamp(startStr);
            const end = parseTimestamp(endStr);

            // Collect text lines
            const textLines: string[] = [];
            i++;
            while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('-->')) {
                textLines.push(lines[i].trim());
                i++;
            }

            if (textLines.length > 0) {
                cues.push({ start, end, text: textLines.join(' ') });
            }
        } else {
            i++;
        }
    }

    return cues;
}

export const PresenterVideo: React.FC<PresenterVideoProps> = ({ src, id, position = 'br', subtitles, onEnded, projectTitle, posterTime }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { playingVideoId, setPlayingVideoId, setCurrentSubtitle, subtitlesEnabled } = useVideoContext();
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showStatus, setShowStatus] = useState(true);
    const [cues, setCues] = useState<Cue[]>([]);
    const [posterReady, setPosterReady] = useState(!posterTime); // If no posterTime, ready immediately
    const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

    // Set video to posterTime on load to show that frame as thumbnail
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !posterTime) return;

        const seekToPosterTime = () => {
            if (video.readyState >= 1) {
                video.currentTime = posterTime;
            }
        };

        const handleSeeked = () => {
            setPosterReady(true);
        };

        // If metadata already loaded, seek immediately
        if (video.readyState >= 1) {
            seekToPosterTime();
        } else {
            video.addEventListener('loadedmetadata', seekToPosterTime);
        }

        video.addEventListener('seeked', handleSeeked);

        return () => {
            video.removeEventListener('loadedmetadata', seekToPosterTime);
            video.removeEventListener('seeked', handleSeeked);
        };
    }, [posterTime]);

    // Load and parse subtitles
    useEffect(() => {
        if (!subtitles) return;

        fetch(subtitles)
            .then(res => res.text())
            .then(content => {
                const parsedCues = parseVTT(content);
                setCues(parsedCues);
            })
            .catch(err => console.error('Failed to load subtitles:', err));
    }, [subtitles]);

    // Sync subtitles with video time
    useEffect(() => {
        const video = videoRef.current;
        if (!video || cues.length === 0) return;

        const handleTimeUpdate = () => {
            // Don't show subtitles if video is paused (e.g., during poster frame seek)
            if (!subtitlesEnabled || video.paused) {
                setCurrentSubtitle('');
                return;
            }

            const currentTime = video.currentTime;
            const activeCue = cues.find(cue => currentTime >= cue.start && currentTime <= cue.end);

            if (activeCue) {
                setCurrentSubtitle(activeCue.text);
            } else {
                setCurrentSubtitle('');
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, [cues, subtitlesEnabled, setCurrentSubtitle]);

    // Hide status indicator after 3s
    useEffect(() => {
        if (showStatus) {
            const timer = setTimeout(() => {
                setShowStatus(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showStatus]);

    // Show status briefly when play state changes
    useEffect(() => {
        setShowStatus(true);
    }, [isPlaying]);

    // Effect to pause this video if another video starts playing
    useEffect(() => {
        if (playingVideoId !== id && isPlaying) {
            if (videoRef.current) {
                videoRef.current.pause();
            }
            setIsPlaying(false);
        }
    }, [playingVideoId, id, isPlaying]);

    // Clear subtitle when video stops
    useEffect(() => {
        if (!isPlaying) {
            setCurrentSubtitle('');
        }
    }, [isPlaying, setCurrentSubtitle]);

    // Handle video ended
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
            setIsPlaying(false);
            setPlayingVideoId(null);
            setCurrentSubtitle('');
            onEnded?.();
        };

        video.addEventListener('ended', handleEnded);
        return () => video.removeEventListener('ended', handleEnded);
    }, [onEnded, setPlayingVideoId, setCurrentSubtitle]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                // If first play and posterTime was set, start from beginning
                if (!hasPlayedOnce && posterTime) {
                    videoRef.current.currentTime = 0;
                    setHasPlayedOnce(true);
                }
                setPlayingVideoId(id);
                videoRef.current.play();
                setIsPlaying(true);
                trackVideoPlay(id, projectTitle);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
                setPlayingVideoId(null);
                trackVideoPause(id, projectTitle);
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
                preload={posterTime ? "auto" : "metadata"}
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} />

            {/* Status Indicator - Below video, fades after 3s */}
            <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-lg z-50 transition-opacity duration-500 ${showStatus ? 'opacity-100' : 'opacity-0'}`}>
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
