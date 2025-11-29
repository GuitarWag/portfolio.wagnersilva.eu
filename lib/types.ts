// Available icon names for cards
export type IconName =
    | 'Code2' | 'Cloud' | 'Database' | 'Globe' | 'Shield' | 'Zap'
    | 'TrendingDown' | 'Users' | 'Server' | 'Lock' | 'MapPin' | 'Rocket'
    | 'FileCheck' | 'Calendar' | 'Mail' | 'CheckCircle2' | 'DollarSign'
    | 'Sparkles' | 'Bot' | 'Puzzle' | 'GitMerge';

export interface SlideData {
    id: string;
    title: string;
    content?: string[];
    image?: string;
    layout: 'title-only' | 'bullets' | 'split-image' | 'full-image' | 'section-header' | 'grid-cards' | 'two-column' | 'three-column' | 'project-detail' | 'skills-chips' | 'why-stockholm' | 'logistics';
    subtitle?: string;
    cards?: {
        icon?: IconName; // Icon name string for serialization
        title?: string;
        value?: string;
        description?: string;
    }[];
    columns?: {
        title?: string;
        content: string[];
    }[];
    // Project specific fields
    context?: string[];
    challenge?: string[];
    solution?: string[];
    impact?: string[];
    techs?: string[];
    diagram?: {
        nodes: any[];
        edges: any[];
    };
    mermaid?: string;
    // Additional detail sections for projects without diagrams
    detailSections?: {
        title: string;
        items: string[];
        color?: 'blue' | 'green' | 'orange' | 'purple' | 'gray';
    }[];
    footer?: string | string[];
    // Skills chips layout
    hardSkills?: string[];
    softSkills?: string[];
    // Location display for relocation-focused presentations
    showLocation?: boolean;
    currentLocation?: string;
    targetLocation?: string;
    // Video explanation for the slide
    videoTranscript?: string;
    videoTranscriptUrl?: string; // URL to .md file with transcript for AI context
    videoUrl?: string;
    videoSubtitles?: string; // URL to .vtt subtitle file
    videoPosition?: 'tr' | 'br' | 'bl' | 'tl' | 'center';
    // Audio explanation for the slide
    audioUrl?: string;
    audioSubtitles?: string; // URL to .vtt subtitle file for audio
}

export interface PresentationData {
    id: string;
    title: string;
    slides: SlideData[];
}
