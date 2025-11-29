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

    includeTechStack: false,
    includeCapabilities: false,
    includeGCPExpertise: false,
    includeRealTimeExperience: false,
    includeGrowthAreas: false,
    includeSkills: true,
    hardSkills: [
        // Cloud & Infrastructure
        'GCP', 'Cloud VPC', 'Kubernetes (GKE)', 'Docker', 'Terraform', 'Linux', 'Cloud Run', 'Cloud Functions', 'GCE', 'CI/CD', 'DevOps',
        // Data Engineering
        'BigQuery', 'Datastream (CDC)', 'Pub/Sub', 'Cloud Storage', 'Dataflow', 'ETL/ELT Pipelines', 'Data Warehousing',
        // Databases
        'PostgreSQL', 'MySQL', 'AlloyDB', 'Cloud SQL', 'Firestore', 'Bigtable', 'Memorystore (Redis)', 'Neo4j', 'Qdrant', 'MongoDB',
        // Programming Languages
        'Python', 'TypeScript', 'JavaScript/Node.js', 'SQL',
        // Frontend
        'React', 'React Native', 'Angular', 'Next.js',
        // AI/ML
        'Vertex AI', 'Gemini Models', 'RAG Systems', 'Vector Embeddings', 'LLMs',
        // APIs & Integration
        'REST APIs', 'API Gateway (APISIX)', 'Third-party Integrations', 'SFTP',
        // Analytics & BI
        'Looker Studio', 'Grafana', 'Data Visualization',
        // Security & Identity
        'Cloud IAP', 'SSO', 'Crowdsec', 'IAM',
        // Monitoring & Observability
        'Prometheus', 'Cloud Monitoring', 'Cloud Logging', 'SRE Practices',
        // Other Technical
        'System Design', 'Architecture Patterns', 'Microservices', 'Serverless', 'Event-Driven Architecture', 'Cost Optimization',
        // Project Management
        'Jira', 'Confluence', 'Agile'
    ],
    softSkills: [
        // Leadership & Management
        'Technical Leadership', 'Team Collaboration', 'Consensus Building',
        // Communication
        'Technical Writing', 'Documentation', 'Translating Technical to Non-Technical', 'Multilingual (PT, EN, ES, learning DE & SV)',
        // Problem-Solving
        'System Thinking', 'Creative Solutions', 'Troubleshooting', 'Root Cause Analysis', 'Adaptability',
        // Work Style
        'Pragmatic Approach', 'Cost-Conscious Mindset', 'Quality Focus', 'Attention to Detail', 'Self-Motivated',
        // Interpersonal
        'Empathy', 'Patience', 'Active Listening', 'Cultural Sensitivity', 'Professional Integrity'
    ],
    skillsAudioUrl: '/video-transcripts/skills.m4a',
    includeCostImpact: false,
    includeAchievements: true,
    includeStrengths: true,
    includeWhyStockholm: true,
};

export const stockholmFullPortfolio: PresentationData = buildPresentation(config);

// Remove the Full-Stack Mastery slide
const fullStackMasteryIndex = stockholmFullPortfolio.slides.findIndex(s => s.id === 'strength-fullstack');
if (fullStackMasteryIndex !== -1) {
    stockholmFullPortfolio.slides.splice(fullStackMasteryIndex, 1);
}

// Remove the Security-First slide
const securityFirstIndex = stockholmFullPortfolio.slides.findIndex(s => s.id === 'strength-security');
if (securityFirstIndex !== -1) {
    stockholmFullPortfolio.slides.splice(securityFirstIndex, 1);
}

// Remove the Scalability slide
const scalabilityIndex = stockholmFullPortfolio.slides.findIndex(s => s.id === 'strength-scale');
if (scalabilityIndex !== -1) {
    stockholmFullPortfolio.slides.splice(scalabilityIndex, 1);
}

// Remove the Problem Solving & Cost Optimization slide
const problemSolvingIndex = stockholmFullPortfolio.slides.findIndex(s => s.id === 'strength-solving');
if (problemSolvingIndex !== -1) {
    stockholmFullPortfolio.slides.splice(problemSolvingIndex, 1);
}

// Remove the Perfect Match slide
const alignmentIndex = stockholmFullPortfolio.slides.findIndex(s => s.id === 'alignment');
if (alignmentIndex !== -1) {
    stockholmFullPortfolio.slides.splice(alignmentIndex, 1);
}

// Remove the What I Bring slide
const whatIBringIndex = stockholmFullPortfolio.slides.findIndex(s => s.id === 'what-i-bring');
if (whatIBringIndex !== -1) {
    stockholmFullPortfolio.slides.splice(whatIBringIndex, 1);
}

// Video URLs base path
const videoBasePath = 'https://storage.googleapis.com/wagnersilva-eu-assets/portfolio-videos';

// Add video to the first slide (title slide)
const firstSlideVideo = `${videoBasePath}/01_FIRST_VIDEO.mp4`;
const firstSlideTranscript = `Hey, thank you so much for being here and taking the time to go through my portfolio. I've curated 12 projects that demonstrate all my technical and soft skills and how adaptable I can be to the company goals. These are all real systems, and they are just a glimpse of the projects that I've built and maintained. Over the past seven, eight years, these systems, they are running in production up to this current date. Let's walk through them.`;
const firstSlideSubtitles = '/video-transcripts/01_FIRST_VIDEO.vtt';
if (stockholmFullPortfolio.slides.length > 0) {
    stockholmFullPortfolio.slides[0].videoUrl = firstSlideVideo;
    stockholmFullPortfolio.slides[0].videoTranscript = firstSlideTranscript;
    stockholmFullPortfolio.slides[0].videoSubtitles = firstSlideSubtitles;
}

// Project 1: Page Builder Platform
const firstProjectSlide = stockholmFullPortfolio.slides.find(s => s.id.startsWith('project-'));
if (firstProjectSlide) {
    firstProjectSlide.videoUrl = `${videoBasePath}/PROJECT_1.mp4`;
    firstProjectSlide.videoPosition = 'br';
    firstProjectSlide.videoSubtitles = '/video-transcripts/PROJECT_1.vtt';
    firstProjectSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_1.md';
}

// Project 2: RAG System
const ragProjectSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-rag-system');
if (ragProjectSlide) {
    ragProjectSlide.videoUrl = `${videoBasePath}/PROJECT_2.mp4`;
    ragProjectSlide.videoPosition = 'br';
    ragProjectSlide.videoSubtitles = '/video-transcripts/PROJECT_2.vtt';
    ragProjectSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_2.md';
}

// Project 3: Tri-directional Sync
const triSyncSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-tri-directional-sync');
if (triSyncSlide) {
    triSyncSlide.videoUrl = `${videoBasePath}/PROJECT_3.mp4`;
    triSyncSlide.videoPosition = 'br';
    triSyncSlide.videoSubtitles = '/video-transcripts/PROJECT_3.vtt';
    triSyncSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_3.md';
}

// Project 4: Cost Optimization
const costOptSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-cost-optimization');
if (costOptSlide) {
    costOptSlide.videoUrl = `${videoBasePath}/PROJECT_4.mp4`;
    costOptSlide.videoPosition = 'br';
    costOptSlide.videoSubtitles = '/video-transcripts/PROJECT_4.vtt';
    costOptSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_4.md';
}

// Project 5: RLS Security
const rlsSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-rls-security');
if (rlsSlide) {
    rlsSlide.videoUrl = `${videoBasePath}/PROJECT_5.mp4`;
    rlsSlide.videoPosition = 'br';
    rlsSlide.videoSubtitles = '/video-transcripts/PROJECT_5.vtt';
    rlsSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_5.md';
}

// Project 6: SFTP Architecture
const sftpSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-sftp-architecture');
if (sftpSlide) {
    sftpSlide.videoUrl = `${videoBasePath}/PROJECT_6.mp4`;
    sftpSlide.videoPosition = 'br';
    sftpSlide.videoSubtitles = '/video-transcripts/PROJECT_6.vtt';
    sftpSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_6.md';
}

// Projects 7-12 don't have videos yet - leaving without video configuration

// Find closing (Thank You) slide and add final video
const lastVideo = `${videoBasePath}/LAST_VIDEO.mp4`;
const closingSlide = stockholmFullPortfolio.slides.find(s => s.id === 'closing');
if (closingSlide) {
    closingSlide.videoUrl = lastVideo;
    closingSlide.videoPosition = 'br';
    closingSlide.videoSubtitles = '/video-transcripts/LAST_VIDEO.vtt';
    closingSlide.videoTranscript = '';
}
