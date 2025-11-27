import { buildPresentation, type PresentationBuildConfig } from '../composer';
import type { PresentationData } from '@/lib/types';

const config: PresentationBuildConfig = {
    id: 'hemnet-fullstack',
    roleType: 'full-stack',
    target: {
        companyName: 'Hemnet',
        roleName: 'Fullstack Developer - Node',
        roleType: 'full-stack',
        requirements: [
            'Senior Fullstack Developer',
            'Node.js + React Experience',
            'Service-Oriented Architecture',
            'Large-Scale Applications',
            'Personalization Experience'
        ],
        myExperience: [
            '7+ Years Full-Stack',
            'Node.js + React (Primary Stack)',
            'Microservices & SOA Expert',
            '40M+ Requests/Month Scale',
            'User-Centric Data Systems'
        ]
    },
    // Project selection emphasizing SOA, Node, React, and personalization-relevant work
    sections: [
        {
            title: 'Service-Oriented Architecture',
            subtitle: 'Breaking Down Monoliths & Building Microservices',
            projectIds: ['apisix-gateway', 'cicd-pipeline']
        },
        {
            title: 'Full-Stack Web Development',
            subtitle: 'React + Node.js Production Systems',
            projectIds: ['page-builder']
        },
        {
            title: 'User Personalization & Data',
            subtitle: 'Intelligent User Experiences at Scale',
            projectIds: ['rag-system', 'tri-directional-sync']
        },
        {
            title: 'Real-Time Data & Integration',
            subtitle: 'Event-Driven Architecture & CDC',
            projectIds: ['cdc-pipeline', 'api-integration']
        },
        {
            title: 'Security & Authentication',
            subtitle: 'Enterprise-Grade User Security',
            projectIds: ['rls-security']
        }
    ],
    // Why Hemnet
    includeWhyCompany: true,
    whyCompanyReasons: [
        'Excited about personalization at scale for millions of Swedish home seekers',
        'Strong alignment with your SOA journey—I\'ve led monolith-to-microservices migrations',
        'Node.js + React is my primary stack with 7+ years of production experience',
        'Passionate about building user-centric products that make life transitions easier',
        'Drawn to Hemnet\'s inclusive culture and collaborative engineering environment'
    ],
    // Growth areas - showing openness to Ruby
    includeGrowthAreas: true,
    growthAreas: [
        'Ruby & Rails: Eager to learn—strong foundation in similar paradigms (Python, TypeScript OOP)',
        'GraphQL: Expanding from REST expertise to graph-based APIs',
        'Swedish Property Market: Excited to understand the domain deeply',
        'Proven track record of quickly mastering new technologies in production environments'
    ],
    includeTechStack: true,
    includeCapabilities: true,
    includeRealTimeExperience: true,
    includeStrengths: true,
    includeWhyStockholm: true,
};

export const hemnetFullStack: PresentationData = buildPresentation(config);
