// Video URL helper for multi-resolution support
// Generates URLs for optimized videos in different resolutions

export interface VideoResolutions {
    '1080p': string;
    '720p': string;
    '480p': string;
}

/**
 * Generate video URLs for all available resolutions
 * @param baseVideoName - The video filename without extension (e.g., "PROJECT_1")
 * @param basePath - Optional custom base path (defaults to optimized bucket)
 * @returns Object with URLs for each resolution
 */
export function getVideoResolutions(
    baseVideoName: string,
    basePath: string = 'https://storage.googleapis.com/wagnersilva-eu-assets/portfolio-videos-optimized'
): VideoResolutions {
    return {
        '1080p': `${basePath}/${baseVideoName}/${baseVideoName}_1080p.mp4`,
        '720p': `${basePath}/${baseVideoName}/${baseVideoName}_720p.mp4`,
        '480p': `${basePath}/${baseVideoName}/${baseVideoName}_480p.mp4`,
    };
}

export function getVideoHlsUrl(
    baseVideoName: string,
    basePath: string = 'https://storage.googleapis.com/wagnersilva-eu-assets/portfolio-videos-optimized'
): string {
    return `${basePath}/${baseVideoName}/master.m3u8`;
}

/**
 * Get the best video quality based on screen size
 * @param resolutions - Available video resolutions
 * @returns URL for the best quality based on viewport
 */
export function getBestVideoQuality(resolutions: VideoResolutions): string {
    if (typeof window === 'undefined') {
        // Server-side: default to 720p
        return resolutions['720p'];
    }

    const width = window.innerWidth;
    const pixelRatio = window.devicePixelRatio || 1;
    const effectiveWidth = width * pixelRatio;

    // Choose resolution based on effective screen width
    if (effectiveWidth >= 1920) {
        return resolutions['1080p'];
    } else if (effectiveWidth >= 1280) {
        return resolutions['720p'];
    } else {
        return resolutions['480p'];
    }
}

/**
 * Legacy function: Get single video URL (for backwards compatibility)
 * @param videoName - The video filename (e.g., "PROJECT_1.mp4")
 * @returns URL for 720p version
 */
export function getLegacyVideoUrl(videoName: string): string {
    const baseName = videoName.replace('.mp4', '');
    return getVideoResolutions(baseName)['720p'];
}
