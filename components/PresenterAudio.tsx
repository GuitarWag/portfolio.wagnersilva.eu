'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { useVideoContext } from './VideoContext';

interface Cue {
    start: number;
    end: number;
    text: string;
}

interface PresenterAudioProps {
    src: string;
    id: string;
    subtitles?: string;
}

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

export const PresenterAudio: React.FC<PresenterAudioProps> = ({ src, id, subtitles }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { playingVideoId, setPlayingVideoId, setCurrentSubtitle, subtitlesEnabled } = useVideoContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const [cues, setCues] = useState<Cue[]>([]);

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

    // Sync subtitles with audio time
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || cues.length === 0) return;

        const handleTimeUpdate = () => {
            if (!subtitlesEnabled) {
                setCurrentSubtitle('');
                return;
            }

            const currentTime = audio.currentTime;
            const activeCue = cues.find(cue => currentTime >= cue.start && currentTime <= cue.end);

            if (activeCue) {
                setCurrentSubtitle(activeCue.text);
            } else {
                setCurrentSubtitle('');
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
    }, [cues, subtitlesEnabled, setCurrentSubtitle]);

    // Effect to pause this audio if another video/audio starts playing
    useEffect(() => {
        if (playingVideoId !== id && isPlaying) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setIsPlaying(false);
        }
    }, [playingVideoId, id, isPlaying]);

    // Clear subtitle when audio stops
    useEffect(() => {
        if (!isPlaying) {
            setCurrentSubtitle('');
        }
    }, [isPlaying, setCurrentSubtitle]);

    // Handle audio ended
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            setIsPlaying(false);
            setPlayingVideoId(null);
            setCurrentSubtitle('');
        };

        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [setPlayingVideoId, setCurrentSubtitle]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                setPlayingVideoId(id);
                audioRef.current.play();
                setIsPlaying(true);
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
                setPlayingVideoId(null);
            }
        }
    };

    return (
        <div className="inline-flex print:hidden">
            <audio ref={audioRef} src={src} />
            <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700 transition-colors"
            >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
        </div>
    );
};
