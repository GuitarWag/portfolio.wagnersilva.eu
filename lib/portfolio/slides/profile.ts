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
        subtitle: 'Full Stack Web Developer | Cloud Architect',
        layout: 'title-only',
        footer: `${profile.yearsExperience} Years Building Scalable Web Platforms`,
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
        title: 'At a Glance',
        layout: 'grid-cards',
        cards: [
            { icon: 'Code2', title: `${profile.yearsExperience} Years`, value: 'Full Stack', description: 'TypeScript, React, Node.js' },
            { icon: 'Cloud', title: 'GCP Native', value: 'Cloud Expert', description: 'Primary platform throughout career' },
            { icon: 'TrendingDown', title: '€48K+', value: 'Cost Savings', description: 'Proven business impact' },
            { icon: 'Globe', title: 'Global Scale', value: 'Enterprise', description: 'EMEA, APAC, Americas' }
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
        title: 'Tech Stack Overlap',
        subtitle: '7+ Years Professional Experience',
        layout: 'two-column',
        columns: [
            {
                title: 'Core Stack',
                content: [
                    'GCP (Cloud Run, Functions, AppEngine)',
                    'TypeScript/JavaScript (Primary Language)',
                    'React & Node.js (Extensive Production Use)',
                    'Databases (PostgreSQL, MySQL, BigQuery)'
                ]
            },
            {
                title: 'Systems & DevOps',
                content: [
                    'Real-time Systems (Pub/Sub, CDC, WebSocket)',
                    'Docker, Kubernetes (GKE)',
                    'Git, GitLab CI/CD',
                    'Infrastructure as Code (Terraform)'
                ]
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
