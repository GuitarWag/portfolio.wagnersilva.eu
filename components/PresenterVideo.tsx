'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useVideoContext } from './VideoContext';
import { trackVideoPlay, trackVideoPause } from '@/lib/analytics';
import { incrementVideoView } from '@/app/actions';

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
    tr: 'top-10 right-10',
    br: 'bottom-10 right-10',
    bl: 'bottom-10 left-10',
    tl: 'top-10 left-10',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

// Transform origin for each position to keep video aligned to corner when scaling
const transformOriginMap: Record<VideoPosition, string> = {
    tr: 'top right',
    br: 'bottom right',
    bl: 'bottom left',
    tl: 'top left',
    center: 'center',
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
    const containerRef = useRef<HTMLDivElement>(null);
    const { playingVideoId, setPlayingVideoId, setCurrentSubtitle, subtitlesEnabled } = useVideoContext();
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showStatus, setShowStatus] = useState(true);
    const [cues, setCues] = useState<Cue[]>([]);
    const [posterReady, setPosterReady] = useState(!posterTime); // If no posterTime, ready immediately
    const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [stickyPosition, setStickyPosition] = useState<{ top?: number; bottom?: number; right?: number; left?: number } | null>(null);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [hasScrolledSincePlay, setHasScrolledSincePlay] = useState(false);

    // Initialize scroll position when video starts playing
    useEffect(() => {
        if (isPlaying) {
            setLastScrollY(window.scrollY);
            setHasScrolledSincePlay(false);
        }
    }, [isPlaying]);

    // Sticky video scroll behavior - only when video is playing
    useEffect(() => {
        if (!isPlaying) {
            setIsSticky(false);
            setStickyPosition(null);
            return;
        }

        const container = containerRef.current;
        if (!container) return;

        let ticking = false;
        let lastStickyState = false;
        const playStartScrollY = window.scrollY;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollingDown = currentScrollY > lastScrollY;

                    // Check if user has scrolled at least 20px since play
                    const scrollDistance = Math.abs(currentScrollY - playStartScrollY);
                    if (!hasScrolledSincePlay && scrollDistance > 20) {
                        setHasScrolledSincePlay(true);
                    }

                    setLastScrollY(currentScrollY);

                    const rect = container.getBoundingClientRect();
                    const slideElement = container.closest('[data-slide]');
                    const slideRect = slideElement?.getBoundingClientRect();

                    if (!slideRect) {
                        ticking = false;
                        return;
                    }

                    const viewportHeight = window.innerHeight;
                    const videoHeight = rect.height;

                    // Thresholds
                    const TOP_THRESHOLD = 80;
                    const BOTTOM_THRESHOLD = viewportHeight - videoHeight - 80;
                    const SLIDE_TOP_THRESHOLD = -150;
                    const SLIDE_BOTTOM_THRESHOLD = viewportHeight + 150;

                    let shouldBeSticky = false;
                    let newStickyPosition = null;

                    // Only apply sticky logic if user has scrolled since pressing play
                    if (hasScrolledSincePlay) {
                        // Check if slide is scrolling out of view
                        const slideScrolledPastTop = slideRect.top < SLIDE_TOP_THRESHOLD;
                        const slideScrolledPastBottom = slideRect.bottom > SLIDE_BOTTOM_THRESHOLD;

                        if (scrollingDown) {
                            // Scrolling DOWN - video should stick to TOP when about to leave viewport at top
                            if (slideScrolledPastTop && rect.top <= TOP_THRESHOLD) {
                                shouldBeSticky = true;
                                // Account for 1.3x scale: video height is 192px, scaled = 250px
                                // Extra 58px from scale, so offset by ~30px from each edge (58/2)
                                newStickyPosition = {
                                    top: 40, // Keep same top distance
                                    right: position.includes('r') ? 40 : undefined,
                                    left: position.includes('l') ? 40 : undefined,
                                };
                            }
                        } else {
                            // Scrolling UP - video should stick to BOTTOM when about to leave viewport at bottom
                            if (slideScrolledPastBottom && rect.bottom >= BOTTOM_THRESHOLD) {
                                shouldBeSticky = true;
                                newStickyPosition = {
                                    bottom: 40, // Match bottom-10 (2.5rem = 40px)
                                    right: position.includes('r') ? 40 : undefined,
                                    left: position.includes('l') ? 40 : undefined,
                                };
                            }
                        }

                        // Check if we should return to normal (slide back in full view)
                        const slideInView = slideRect.top > -100 && slideRect.bottom < viewportHeight + 100;
                        if (slideInView) {
                            shouldBeSticky = false;
                            newStickyPosition = null;
                        }
                    }

                    // Only update if state changed
                    if (shouldBeSticky !== lastStickyState) {
                        lastStickyState = shouldBeSticky;
                        setIsSticky(shouldBeSticky);
                        setStickyPosition(newStickyPosition);
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Don't run initial check - wait for user to scroll

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isPlaying, position, lastScrollY, hasScrolledSincePlay]);

    // Reset sticky state when video stops
    useEffect(() => {
        if (!isPlaying) {
            setIsSticky(false);
            setStickyPosition(null);
            setHasScrolledSincePlay(false);
        }
    }, [isPlaying]);

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

    const toggleMute = React.useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    }, []);

    const togglePlay = React.useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                // If first play and posterTime was set, start from beginning
                if (!hasPlayedOnce && posterTime) {
                    videoRef.current.currentTime = 0;
                    setHasPlayedOnce(true);
                }

                // Track view in Firestore
                incrementVideoView(id);

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
    }, [hasPlayedOnce, posterTime, id, setPlayingVideoId, projectTitle]);

    // Calculate transform origin based on sticky state
    const getTransformOrigin = () => {
        if (!isSticky) {
            return transformOriginMap[position];
        }
        // When sticky, use the edge we're sticking to
        if (stickyPosition?.top !== undefined) {
            // Sticking to top
            return position.includes('r') ? 'top right' : 'top left';
        } else if (stickyPosition?.bottom !== undefined) {
            // Sticking to bottom
            return position.includes('r') ? 'bottom right' : 'bottom left';
        }
        return transformOriginMap[position];
    };

    return (
        <div
            ref={containerRef}
            className={`absolute ${positionClasses[position]} w-48 h-48 bg-slate-900 rounded-full overflow-hidden shadow-2xl border-4 ${isSticky ? 'border-blue-500 shadow-blue-500/50' : 'border-white/20'} group print:hidden`}
            style={{
                position: isSticky ? 'fixed' : 'absolute',
                zIndex: isSticky ? 50 : 40,
                willChange: isPlaying ? 'transform' : 'auto',
                transform: isPlaying ? 'scale(1.3)' : 'scale(1)',
                transformOrigin: getTransformOrigin(),
                transition: 'transform 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out',
                ...(isSticky && stickyPosition ? stickyPosition : {})
            }}
        >
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
