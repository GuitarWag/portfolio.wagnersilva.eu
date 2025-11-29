'use client';

import { useEffect, useState } from 'react';

interface TextTypeAnimationProps {
    text: string;
    speed?: number; // milliseconds per character
    delay?: number; // initial delay before starting
    onComplete?: () => void;
    className?: string;
}

export function TextTypeAnimation({
    text,
    speed = 30,
    delay = 0,
    onComplete,
    className = ''
}: TextTypeAnimationProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Reset state when text changes
        setDisplayedText('');
        setCurrentIndex(0);
        setIsComplete(false);
    }, [text]);

    useEffect(() => {
        if (currentIndex >= text.length) {
            if (!isComplete) {
                setIsComplete(true);
                onComplete?.();
            }
            return;
        }

        const timer = setTimeout(
            () => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            },
            currentIndex === 0 ? delay : speed
        );

        return () => clearTimeout(timer);
    }, [currentIndex, text, speed, delay, isComplete, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            {!isComplete && <span className="animate-pulse">|</span>}
        </span>
    );
}
