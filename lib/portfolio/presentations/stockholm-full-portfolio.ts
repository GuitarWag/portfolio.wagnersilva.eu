import { buildPresentation, type PresentationBuildConfig } from '../composer';
import type { PresentationData } from '@/lib/types';
import { projectsRegistry } from '../projects';

const config: PresentationBuildConfig = {
    id: 'stockholm-full-portfolio',
    roleType: 'full-stack',
    target: {
        companyName: 'Stockholm Tech Scene',
        roleName: 'Senior Software Engineer',
        roleType: 'full-stack',
        requirements: [
            'Full Stack Development (React, Node.js, Next.js)',
            'Cloud Architecture (GCP, AWS)',
            'Data Engineering & Pipelines',
            'System Design & Scalability',
            'Technical Leadership'
        ],
        myExperience: [
            'Comprehensive portfolio demonstrating end-to-end expertise from frontend UX to backend scalability and data engineering.'
        ]
    },
    // Include all projects
    projectIds: Object.keys(projectsRegistry),

    includeTechStack: true,
    includeCapabilities: true,
    includeGCPExpertise: true,
    includeRealTimeExperience: true,
    includeGrowthAreas: true,
    growthAreas: [
        'Advanced AI/ML Engineering',
        'Rust Systems Programming',
        'Distributed Systems Architecture'
    ],
    includeCostImpact: true,
    includeAchievements: true,
    includeStrengths: true,
    includeWhyStockholm: true,
};

export const stockholmFullPortfolio: PresentationData = buildPresentation(config);

// Add video to the first slide
if (stockholmFullPortfolio.slides.length > 0) {
    stockholmFullPortfolio.slides[0].videoUrl = 'https://storage.googleapis.com/wagnersilva-eu-assets/placeholder.mp4';
}
