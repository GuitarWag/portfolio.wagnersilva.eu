import type { SlideData } from '@/lib/types';

// Project categories for organization and filtering
export type ProjectCategory =
    | 'security'
    | 'data-integration'
    | 'orchestration'
    | 'ai-ml'
    | 'infrastructure'
    | 'full-stack'
    | 'devops'
    | 'leadership';

// Technology tags for filtering and display
export type TechTag = string;

// A single portfolio project - the core reusable unit
export interface ProjectData {
    id: string;
    title: string;
    subtitle: string;
    category: ProjectCategory;
    tags: TechTag[];
    // The project content
    context?: string[];
    challenge: string[];
    solution: string[];
    impact: string[];
    techs: string[];
    // Visual representation
    mermaid?: string;
    diagram?: {
        nodes: any[];
        edges: any[];
    };
    detailSections?: {
        title: string;
        items: string[];
        color?: 'blue' | 'green' | 'orange' | 'purple' | 'gray';
    }[];
}

// Target company/role customization
export interface TargetConfig {
    companyName: string;
    roleName: string;
    roleType: 'full-stack' | 'data-engineer' | 'cloud-architect' | 'backend' | 'frontend';
    // Custom "Why Company" content
    whyCompany?: string[];
    // Custom requirements alignment
    requirements?: string[];
    myExperience?: string[];
    // Optional: specific tech stack to highlight
    highlightTechs?: string[];
}

// Personal profile data - your info
export interface ProfileData {
    name: string;
    currentLocation: string;
    targetLocation: string;
    yearsExperience: string;
    email: string;
    website: string;
    linkedin: string;
    image?: string;
    visaStatus: string;
    startDate: string;
}

// Presentation composition config
export interface PresentationConfig {
    id: string;
    target: TargetConfig;
    profile: ProfileData;
    // Select which projects to include (by id)
    projectIds: string[];
    // Optional: group projects by section
    sections?: {
        title: string;
        subtitle: string;
        projectIds: string[];
    }[];
    // Include optional slide groups
    includeGrowthAreas?: boolean;
    includeTechStack?: boolean;
    includeStrengths?: boolean;
}

// Helper to convert ProjectData to SlideData
export function projectToSlide(project: ProjectData, index?: number): SlideData {
    const title = index !== undefined
        ? `PROJECT #${index} - ${project.title}`.toUpperCase()
        : project.title;

    return {
        id: `project-${project.id}`,
        title,
        subtitle: project.subtitle,
        layout: 'project-detail',
        context: project.context,
        challenge: project.challenge,
        solution: project.solution,
        impact: project.impact,
        techs: project.techs,
        mermaid: project.mermaid,
        diagram: project.diagram,
        detailSections: project.detailSections,
    };
}
