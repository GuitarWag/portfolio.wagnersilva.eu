// Google Analytics utility functions

export const GA_TRACKING_ID = 'G-W3VDTC9E1S';

// Track page views
export const pageview = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        });
    }
};

const isProduction = process.env.NODE_ENV === 'production';

// Track events
export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (!isProduction) return;

    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Specific event helpers
export const trackVideoPlay = (videoId: string, projectTitle?: string) => {
    event({
        action: 'video_play',
        category: 'Video',
        label: projectTitle || videoId,
    });
};

export const trackVideoPause = (videoId: string, projectTitle?: string) => {
    event({
        action: 'video_pause',
        category: 'Video',
        label: projectTitle || videoId,
    });
};

export const trackTLDRClick = (projectTitle: string) => {
    event({
        action: 'tldr_click',
        category: 'AI Features',
        label: projectTitle,
    });
};

export const trackTLDRSuccess = (projectTitle: string) => {
    event({
        action: 'tldr_success',
        category: 'AI Features',
        label: projectTitle,
    });
};

export const trackTLDRError = (projectTitle: string, error: string) => {
    event({
        action: 'tldr_error',
        category: 'AI Features',
        label: `${projectTitle}: ${error}`,
    });
};

// Extend Window interface for TypeScript
declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'js',
            targetId: string | Date,
            config?: Record<string, unknown>
        ) => void;
    }
}
