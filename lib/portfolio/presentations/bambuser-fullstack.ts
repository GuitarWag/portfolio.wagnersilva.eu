import { buildPresentation, type PresentationBuildConfig } from '../composer';
import type { PresentationData } from '@/lib/types';

const config: PresentationBuildConfig = {
    id: 'bambuser-fullstack',
    roleType: 'full-stack',
    target: {
        companyName: 'Bambuser',
        roleName: 'Full Stack Web Developer',
        roleType: 'full-stack',
        requirements: [
            '5+ Years Full-Stack',
            '3+ Years Frontend/Backend',
            'GCP Experience',
            'Real-time Systems',
            'Security Mindset'
        ],
        myExperience: [
            '7+ Years Professional Exp.',
            '7+ Years Balanced Stack',
            'Primary Cloud Platform',
            'Extensive (CDC, Pub/Sub)',
            'Security-First Approach'
        ]
    },
    // Project selection for full-stack role
    projectIds: [
        'page-builder',
        'rag-system',
        'tri-directional-sync',
        'cost-optimization',
        'rls-security',
        'sftp-architecture',
        'api-integration',
        'cicd-pipeline',
        'apisix-gateway',
        'cdc-pipeline'
    ],
    // Optional sections
    includeWhyCompany: true,
    whyCompanyReasons: [
        'Excited about video commerce innovation and real-time technologies',
        'Strong technical stack alignment (GCP, TypeScript, React)',
        'Opportunity to work on challenging real-time live video platforms',
        'Desire to learn from world-class engineers and open source contributors',
        'Committed to relocating to Stockholm (already eligible to work in Sweden)'
    ],
    includeGrowthAreas: true,
    growthAreas: [
        'AWS Ecosystem: Eager to translate deep GCP knowledge to AWS',
        'Video Streaming Specifics: Excited to dive deep into HLS and WebRTC',
        'E-commerce Platforms: Quick learner ready to master WooCommerce/Shopify integrations',
        'Proven track record of quickly mastering new technologies when needed'
    ],
    includeTechStack: true,
    includeCapabilities: true,
    includeGCPExpertise: true,
    includeRealTimeExperience: true,
    includeStrengths: true,
    includeWhyStockholm: true,
};

export const bambuserFullStack: PresentationData = buildPresentation(config);
