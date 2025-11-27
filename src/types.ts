export interface SlideData {
    id: string;
    title: string;
    content?: string[];
    image?: string;
    layout: 'title-only' | 'bullets' | 'split-image' | 'full-image' | 'section-header' | 'grid-cards' | 'two-column' | 'three-column' | 'project-detail';
    subtitle?: string;
    cards?: {
        icon?: any; // Lucide icon component or string
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
}

export interface PresentationData {
    id: string;
    title: string;
    slides: SlideData[];
}
