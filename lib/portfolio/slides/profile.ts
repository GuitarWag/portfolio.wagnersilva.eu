import type { SlideData } from '@/lib/types';
import type { ProfileData } from '../types';

// Default profile - Wagner Silva
export const defaultProfile: ProfileData = {
    name: 'Wagner Silva',
    currentLocation: 'Lisbon',
    targetLocation: 'Stockholm',
    yearsExperience: '7+',
    email: 'wagnersilva.eu.cloud@gmail.com',
    website: 'wagnersilva.eu',
    linkedin: 'linkedin.com/in/wagnersilva-eu',
    image: '/wagner.png',
    visaStatus: 'Need Swedish work permit',
    startDate: 'ASAP',
};

// Generate title slide for Full Stack role
export function createFullStackTitleSlide(
    profile: ProfileData,
    companyName: string
): SlideData {
    return {
        id: 'title',
        title: profile.name,
        subtitle: 'Software Engineer | Cloud Architect | Data Engineer',
        layout: 'title-only',
        footer: `${profile.yearsExperience} of Pragmatic Software & Data Engineering - Scalable Cloud Solutions, Proven Impact`,
        image: profile.image,
        showLocation: true,
        currentLocation: profile.currentLocation,
        targetLocation: profile.targetLocation
    };
}

// Generate title slide for Data Engineer role
export function createDataEngineerTitleSlide(
    profile: ProfileData,
    companyName: string
): SlideData {
    return {
        id: 'title',
        title: profile.name,
        subtitle: 'Data Engineer | Cloud Architect | GCP Expert',
        layout: 'title-only',
        footer: `${profile.yearsExperience} Years Building Production Data Systems`,
        image: profile.image,
        showLocation: true,
        currentLocation: profile.currentLocation,
        targetLocation: profile.targetLocation
    };
}

// "At a Glance" slide for Full Stack
export function createFullStackGlanceSlide(profile: ProfileData): SlideData {
    return {
        id: 'at-a-glance',
        title: 'Portfolio At a Glance',
        layout: 'grid-cards',
        cards: [
            { icon: 'Code2', title: 'Software Engineering', value: `${profile.yearsExperience} Years Across Stack`, description: 'System design, APIs, databases, DevOps - from concept to production' },
            { icon: 'Cloud', title: 'GCP Specialist', value: '6+ Years on Google Cloud', description: 'BigQuery, Cloud Run, Cloud SQL, GKE, Vertex AI, and the whole stack of services' },
            { icon: 'TrendingDown', title: 'Cost Savings', value: '€48K+ Annual Value Delivered', description: 'Infrastructure optimization' },
            { icon: 'Globe', title: 'Enterprise', value: 'Global Scale', description: 'Production systems across EMEA, APAC, Americas' }
        ]
    };
}

// "At a Glance" slide for Data Engineer
export function createDataEngineerGlanceSlide(profile: ProfileData): SlideData {
    return {
        id: 'exec-summary',
        title: 'Portfolio at a Glance',
        layout: 'grid-cards',
        cards: [
            { icon: 'CheckCircle2', value: '10', title: 'Production Projects', description: 'Enterprise-grade solutions' },
            { icon: 'DollarSign', value: '€48K', title: 'Annual Cost Savings', description: 'Infrastructure optimization' },
            { icon: 'Sparkles', value: 'Current', title: 'Tech Skills', description: 'Sharpened & up-to-date' },
            { icon: 'Cloud', value: `${profile.yearsExperience}`, title: 'Years Experience', description: 'Cloud-native expertise' }
        ],
        footer: ['These 10 projects are a sample of my work—', 'reliable, scalable solutions built on peer cooperation and cross-team collaboration.']
    };
}

// Tech Stack slide for Full Stack
export function createFullStackTechSlide(): SlideData {
    return {
        id: 'tech-stack',
        title: 'Modern Productivity Tools',
        subtitle: 'Staying Current with Latest AI Code Assistants',
        layout: 'grid-cards',
        cards: [
            {
                logo: '/Claude Symbol SVG.svg',
                title: 'Claude Code',
                description: ''
            },
            {
                logo: '/OpenAI Symbol SVG.svg',
                title: 'OpenAI Codex',
                description: ''
            },
            {
                logo: '/gemini.png',
                title: 'Google Gemini Code Assist',
                description: ''
            },
            {
                logo: '/Warp Symbol SVG.svg',
                title: 'Warp AI',
                description: ''
            }
        ]
    };
}

// Tech Stack slide for Data Engineer
export function createDataEngineerTechSlide(): SlideData {
    return {
        id: 'tech-stack',
        title: 'Technology Stack & Capabilities',
        layout: 'three-column',
        columns: [
            {
                title: 'Cloud & Infrastructure',
                content: [
                    'Google Cloud Platform',
                    'Kubernetes (GKE)',
                    'Docker & Containerization',
                    'Terraform (IaC)',
                    'Linux Systems'
                ]
            },
            {
                title: 'Data & Databases',
                content: [
                    'BigQuery, Datastream, Pub/Sub',
                    'Cloud Storage',
                    'AlloyDB, Cloud SQL (PostgreSQL)',
                    'Firestore, Bigtable, Memorystore',
                    'Neo4j (Graph), Qdrant (Vector)'
                ]
            },
            {
                title: 'Dev & Integration',
                content: [
                    'Python',
                    'TypeScript, SQL',
                    'Cloud Run & Jobs, Functions',
                    'APISIX, REST APIs, SFTP',
                    'Vertex AI, Gemini, RAG'
                ]
            }
        ],
        detailSections: [
            {
                title: 'AI Code Assistants',
                items: [
                    'Claude Code - Advanced IDE integration',
                    'GitHub Copilot - Code completion',
                    'Google Gemini Code Assist',
                    'Warp AI Terminal',
                ],
                logos: [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/1200px-Claude_AI_symbol.svg.png',
                    'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
                    'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
                    'https://assets-global.website-files.com/63d75bf5c2e9b07bb401ea4b/646cf28b04c49b78e75e1a5d_warp-logo.png',
                ],
                color: 'purple'
            }
        ]
    };
}

// Full Stack capabilities slide
export function createFullStackCapabilitiesSlide(): SlideData {
    return {
        id: 'full-stack-caps',
        title: 'Full Stack Capabilities',
        layout: 'two-column',
        columns: [
            {
                title: 'Frontend & Backend',
                content: [
                    'React with TypeScript, Component Architecture',
                    'Performance Optimization, i18n/Localization',
                    'Node.js & TypeScript Microservices',
                    'Python for Data Processing',
                    'REST APIs & Serverless Architectures'
                ]
            },
            {
                title: 'Infrastructure & Data',
                content: [
                    'GCP Serverless (Cloud Run, Functions)',
                    'Kubernetes (GKE), CI/CD Pipelines',
                    'Relational (PostgreSQL, MySQL)',
                    'NoSQL (Firestore, Bigtable)',
                    'Caching (Redis/Memorystore)'
                ]
            }
        ]
    };
}

// GCP Expertise slide
export function createGCPExpertiseSlide(): SlideData {
    return {
        id: 'gcp-expertise',
        title: 'GCP Expertise',
        subtitle: 'Primary Cloud Platform (7+ Years)',
        layout: 'grid-cards',
        cards: [
            { icon: 'Server', title: 'Compute', description: 'Cloud Run, Functions, GKE, GCE' },
            { icon: 'Database', title: 'Data', description: 'Cloud SQL, Firestore, BigQuery, Redis' },
            { icon: 'Zap', title: 'Messaging', description: 'Pub/Sub, Event Streaming' },
            { icon: 'Shield', title: 'Security', description: 'IAM, IAP, Secret Manager' }
        ]
    };
}

// Real-time systems experience
export function createRealTimeExperienceSlide(): SlideData {
    return {
        id: 'real-time',
        title: 'Real-Time Systems Experience',
        layout: 'bullets',
        content: [
            'CDC pipelines with near-zero latency replication',
            'Pub/Sub event streaming for high-throughput messaging',
            'Tri-directional sync orchestration with conflict resolution',
            'WebSocket implementations for API gateways',
            'Real-time analytics with BigQuery streaming inserts',
            'High-performance caching strategies for sub-second response'
        ]
    };
}

// Areas for growth (customizable)
export function createGrowthAreasSlide(areasForGrowth: string[]): SlideData {
    return {
        id: 'growth',
        title: 'Areas for Growth',
        layout: 'bullets',
        content: areasForGrowth
    };
}

// Skills slide with chips
export function createSkillsSlide(hardSkills: string[], softSkills: string[], audioUrl?: string, audioSubtitles?: string): SlideData {
    return {
        id: 'skills',
        title: 'Skills',
        layout: 'skills-chips',
        hardSkills,
        softSkills,
        audioUrl,
        audioSubtitles,
        footer: "Each project taught me something new. I'm not done learning."
    };
}
