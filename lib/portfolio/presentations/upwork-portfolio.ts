import type { PresentationData, SlideData } from '@/lib/types';
import { defaultProfile } from '../slides/profile';
import { getProjectsById } from '../projects';
import { projectToSlide } from '../types';
import {
    createDataEngineerGlanceSlide,
    createDataEngineerTechSlide,
    createSectionHeader,
    createCostImpactSlide,
    createAchievementsSlide,
    createAlignmentSlide,
    createWhatIBringSlide,
} from '../slides';

// Custom title slide for Upwork (no Stockholm mention)
function createUpworkTitleSlide(): SlideData {
    return {
        id: 'title',
        title: 'Wagner Silva',
        subtitle: 'Data Engineer | Software Engineer | Cloud Architect',
        layout: 'title-only',
        footer: '7+ Years Building Scalable Cloud Solutions',
        image: defaultProfile.image
    };
}

// Custom closing slide for Upwork (no Stockholm mention)
function createUpworkClosingSlide(): SlideData {
    return {
        id: 'closing',
        title: 'Let\'s Work Together',
        subtitle: 'Available for Your Next Project',
        layout: 'title-only',
        content: ['Proven Track Record of Delivering Value'],
        footer: [
            `${defaultProfile.name} | Data Engineering | Software Engineer | Cloud Architect`,
            `${defaultProfile.email}`,
            `${defaultProfile.website} | ${defaultProfile.linkedin}`
        ]
    };
}

// Build the presentation manually to avoid Stockholm mentions
const slides: SlideData[] = [];

// 1. Custom title slide
slides.push(createUpworkTitleSlide());

// 2. At a Glance
slides.push(createDataEngineerGlanceSlide(defaultProfile));

// 3. Tech Stack
slides.push(createDataEngineerTechSlide());

// 4. Projects - sectioned
const sections = [
    {
        title: 'Full-Stack Web Development',
        subtitle: 'Complete Ownership from UI to Infrastructure',
        projectIds: ['page-builder']
    },
    {
        title: 'AI & Innovation',
        subtitle: 'Enterprise AI Platform with RAG',
        projectIds: ['rag-system']
    },
    {
        title: 'Data Integration & Orchestration',
        subtitle: 'Real-Time Multi-System Synchronization',
        projectIds: ['tri-directional-sync']
    },
    {
        title: 'Cost Optimization & Performance',
        subtitle: 'Strategic Infrastructure Optimization',
        projectIds: ['cost-optimization']
    },
    {
        title: 'Security & Compliance',
        subtitle: 'Enterprise-Grade Security Solutions',
        projectIds: ['rls-security', 'db-anonymization']
    },
    {
        title: 'Data Engineering Pipelines',
        subtitle: 'Scalable & Intelligent Data Flows',
        projectIds: ['sftp-architecture', 'api-integration', 'cdc-pipeline']
    },
    {
        title: 'DevOps & Infrastructure',
        subtitle: 'Production-Grade Automation',
        projectIds: ['cicd-pipeline', 'apisix-gateway']
    }
];

for (const section of sections) {
    slides.push(createSectionHeader(section.title, section.subtitle));
    const projects = getProjectsById(section.projectIds);
    for (const project of projects) {
        slides.push(projectToSlide(project));
    }
}

// 5. Cost Impact
slides.push(createCostImpactSlide());

// 6. Achievements
slides.push(createAchievementsSlide());

// 7. Alignment slide
slides.push(createAlignmentSlide({
    companyName: 'Your Project',
    roleName: 'Data Engineering | Software Engineer | Cloud Architect',
    roleType: 'full-stack',
    requirements: [
        '7+ years full-stack & data engineering experience',
        'TypeScript/React/Node.js/Python expert',
        'GCP native (primary cloud platform)',
        'Proven business impact',
        'Global scale experience'
    ],
    myExperience: [
        '7+ Years Professional Experience',
        'Primary Stack Throughout Career',
        'GCP Native (Primary Cloud Platform)',
        '€48K+ Annual Cost Savings Delivered',
        'Multi-Continent Operations (EMEA, APAC, Americas)'
    ]
}));

// 8. What I Bring
slides.push(createWhatIBringSlide('Your Project'));

// 9. Custom closing slide (no Stockholm)
slides.push(createUpworkClosingSlide());

export const upworkPortfolio: PresentationData = {
    id: 'upwork-portfolio',
    title: 'Wagner Silva - Data Engineering | Software Engineer | Cloud Architect',
    slides
};
