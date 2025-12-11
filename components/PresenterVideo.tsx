'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useVideoContext } from './VideoContext';
import { trackVideoPlay, trackVideoPause } from '@/lib/analytics';
import { incrementVideoView } from '@/app/actions';
import { getVideoHlsUrl } from '@/lib/video-utils';
import Hls from 'hls.js';

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
    mode?: 'floating' | 'inline';
    className?: string; // Allow external hiding/styling
}

const positionClasses: Record<VideoPosition, string> = {
    tr: 'top-4 right-4 md:top-10 md:right-10',
    br: 'top-4 left-4 md:top-auto md:left-auto md:bottom-10 md:right-10', // Mobile: Top-left override, Desktop: Reset to Bottom-right
    bl: 'bottom-4 left-4 md:bottom-10 md:left-10',
    tl: 'top-4 left-4 md:top-10 md:left-10',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

// Transform origin classes for responsive scaling
const originClasses: Record<VideoPosition, string> = {
    tr: 'origin-top-right',
    br: 'origin-top-left md:origin-bottom-right',
    bl: 'origin-bottom-left',
    tl: 'origin-top-left',
    center: 'origin-center',
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
    const lines = content.split('\n');
    const cues: Cue[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        // Look for timestamp line (contains -->)
        if (line.includes('-->')) {
            const [startStr, endStr] = line.split('-->').map(s => s.trim());
            const start = parseTimestamp(startStr);
            const end = parseTimestamp(endStr);

            // Collect text lines until empty line
            const textLines: string[] = [];
            i++;
            while (i < lines.length && lines[i].trim() !== '') {
                textLines.push(lines[i].trim());
                i++;
            }

            if (textLines.length > 0) {
                cues.push({
                    start,
                    end,
                    text: textLines.join(' ')
                });
            }
        }
        i++;
    }

    return cues;
}

export const PresenterVideo: React.FC<PresenterVideoProps> = ({ src, id, position = 'br', subtitles, onEnded, projectTitle, posterTime, mode = 'floating', className = '' }) => {
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
    const [currentQuality, setCurrentQuality] = useState<string>('Auto');

    // Initialize HLS
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        // Reset state for new source
        setCurrentQuality('Auto');

        // Extract clean video name to build HLS URL
        const filename = src.split('/').pop() || '';
        const basename = filename.replace('.mp4', '');
        const hlsUrl = getVideoHlsUrl(basename);
        // Fallback or legacy URL if HLS fails
        const legacyUrl = src;

        let hls: Hls | null = null;
        let isMounted = true;

        const loadLegacyVideo = () => {
            console.log("HLS failed or not supported, falling back to legacy MP4");
            // If HLS fails, we might be trying to play a video that hasn't been processed yet
            // Fallback to the original src (legacy MP4)
            if (video.src !== legacyUrl) {
                video.src = legacyUrl;
                // Force legacy quality badge
                setCurrentQuality('Legacy');
            }
        };

        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90,
            });

            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // If we have a poster time and haven't played yet, seek to it
                // We do this after manifest load to avoid race conditions
                if (posterTime && !hasPlayedOnce && isMounted) {
                    video.currentTime = posterTime;
                }
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
                if (!isMounted) return;
                const level = hls?.levels[data.level];
                if (level) {
                    // Map height to label
                    if (level.height >= 1080) setCurrentQuality('1080p (HLS)');
                    else if (level.height >= 720) setCurrentQuality('720p (HLS)');
                    else if (level.height >= 480) setCurrentQuality('480p (HLS)');
                    else setCurrentQuality(`${level.height}p`);
                }
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.warn("HLS fatal network error, falling back to MP4");
                            if (hls) {
                                hls.destroy();
                                hls = null;
                            }
                            loadLegacyVideo();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.warn("HLS fatal media error, trying to recover");
                            hls?.recoverMediaError();
                            break;
                        default:
                            if (hls) {
                                hls.destroy();
                                hls = null;
                            }
                            loadLegacyVideo();
                            break;
                    }
                }
            });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = hlsUrl;
            if (isMounted) setCurrentQuality('Auto (HLS)');

            // Check if it actually plays, otherwise fallback
            const handleError = (e: Event) => {
                console.warn("Native HLS error, falling back");
                loadLegacyVideo();
            };

            video.addEventListener('error', handleError, { once: true });
            return () => video.removeEventListener('error', handleError);

        } else {
            // No HLS support
            loadLegacyVideo();
        }

        return () => {
            isMounted = false;
            if (hls) {
                hls.destroy();
            }
        };
    }, [src, posterTime, hasPlayedOnce]);


    // Initialize scroll position when video starts playing
    useEffect(() => {
        if (isPlaying) {
            setLastScrollY(window.scrollY);
            setHasScrolledSincePlay(false);
        }
    }, [isPlaying]);

    // Optimize scroll handler with useCallback
    useEffect(() => {
        if (!isPlaying) {
            setIsSticky(false);
            setStickyPosition(null);
            return;
        }

        const container = containerRef.current;
        if (!container) return;

        let ticking = false;
        let lastStickyState = isSticky; // Use local var to avoid closure staleness issues if not careful, though effect re-runs on isPlaying change
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
                    if (hasScrolledSincePlay || scrollDistance > 20) { // Check distance again here to be safe
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

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isPlaying, position, lastScrollY, hasScrolledSincePlay, isSticky]);

    // Reset sticky state when video stops
    useEffect(() => {
        if (!isPlaying) {
            setIsSticky(false);
            setStickyPosition(null);
            setHasScrolledSincePlay(false);
        }
    }, [isPlaying]);

    // Poster time seek logic - only for non-HLS or when HLS event not sufficient
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !posterTime) return;

        // If we are using HLS.js, seeking is handled in MANIFEST_PARSED
        // This is primarily for the non-HLS / fallback path
        const seekToPosterTime = () => {
            if (video.readyState >= 1 && !hasPlayedOnce) {
                // Check if src is NOT a blob (blob means HLS.js is controlling it)
                if (!video.src.startsWith('blob:')) {
                    video.currentTime = posterTime;
                }
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
    }, [posterTime, hasPlayedOnce]);

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

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    }, []);

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                // If first play and posterTime was set, start from beginning
                if (!hasPlayedOnce && posterTime) {
                    videoRef.current.currentTime = 0;
                    setHasPlayedOnce(true);
                }

                incrementVideoView(id);
                setPlayingVideoId(id);

                const attemptPlay = () => {
                    const playPromise = videoRef.current?.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                setIsPlaying(true);
                                trackVideoPlay(id, projectTitle);
                            })
                            .catch(error => {
                                // AbortError is commonly caused by interrupting a load (like the seek above)
                                // We retry once if it's an AbortError to ensure playback starts
                                if (error.name === 'AbortError') {
                                    console.log("Play interrupted (likely by seek), retrying...");
                                    // Small delay to let the interruption settle
                                    setTimeout(() => {
                                        videoRef.current?.play()
                                            .then(() => setIsPlaying(true))
                                            .catch(e => console.warn("Retry play failed:", e));
                                    }, 50);
                                } else {
                                    console.warn("Play failed:", error);
                                    setIsPlaying(false);
                                }
                            });
                    }
                };

                attemptPlay();

            } else {
                videoRef.current.pause();
                setIsPlaying(false);
                setPlayingVideoId(null);
                trackVideoPause(id, projectTitle);
            }
        }
    }, [hasPlayedOnce, posterTime, id, setPlayingVideoId, projectTitle]);

    // Get appropriate origin class
    const getOriginClass = useCallback(() => {
        if (mode === 'inline') return ''; // No origin scaling for inline
        if (!isSticky) {
            return originClasses[position];
        }
        if (stickyPosition?.top !== undefined) {
            return position.includes('r') ? 'origin-top-right' : 'origin-top-left';
        } else if (stickyPosition?.bottom !== undefined) {
            return position.includes('r') ? 'origin-bottom-right' : 'origin-bottom-left';
        }
        return originClasses[position];
    }, [isSticky, stickyPosition, position, mode]);

    const containerStyle = useMemo(() => {
        if (mode === 'inline') return {}; // Minimal styles for inline

        return {
            position: (isSticky ? 'fixed' : 'absolute') as any,
            zIndex: isSticky ? 50 : 40,
            willChange: isPlaying ? 'transform' : 'auto',
            transform: isPlaying ? 'scale(1.3)' : 'scale(1)',
            transition: 'transform 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out',
            ...(isSticky && stickyPosition ? stickyPosition : {})
        };
    }, [isSticky, isPlaying, stickyPosition, mode]);

    // Dynamic classes based on mode
    const baseContainerClasses = mode === 'floating'
        ? `absolute ${positionClasses[position]} ${getOriginClass()} w-24 h-24 md:w-48 md:h-48 bg-slate-900 rounded-full overflow-hidden shadow-2xl border-4 ${isSticky ? 'border-blue-500 shadow-blue-500/50' : 'border-white/20'}`
        : `relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg border-2 border-slate-700`; // Inline styles

    return (
        <div
            ref={containerRef}
            className={`${baseContainerClasses} group print:hidden ${className}`}
            style={containerStyle}
        >
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                // Use metadata preload to avoid race condition with HLS attach
                preload="metadata"
            // src attribute removed as it's handled by HLS logic
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} />

            {/* Quality Badge (visible on hover) */}
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {currentQuality}
            </div>

            {/* Controls Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <button
                    onClick={togglePlay}
                    className="p-4 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white shadow-lg backdrop-blur-sm transition-all transform hover:scale-110"
                >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
            </div>

            {/* Bottom Controls (Mute only) */}
            <div className={`absolute bottom-4 left-0 right-0 hidden md:flex justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors border border-white/10"
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>
        </div>
    );
};
