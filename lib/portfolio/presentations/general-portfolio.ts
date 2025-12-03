import { buildPresentation, type PresentationBuildConfig } from '../composer';
import type { PresentationData } from '@/lib/types';
import { projectsRegistry } from '../projects';

const config: PresentationBuildConfig = {
    id: 'general-portfolio',
    roleType: 'full-stack',
    target: {
        companyName: 'Portfolio',
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
    includeWhyStockholm: false,
};

export const generalPortfolio: PresentationData = buildPresentation(config);

// Remove location from title slide
if (generalPortfolio.slides.length > 0 && generalPortfolio.slides[0].id === 'title') {
    generalPortfolio.slides[0].showLocation = false;
}

// Remove the Full-Stack Mastery slide
const fullStackMasteryIndex = generalPortfolio.slides.findIndex(s => s.id === 'strength-fullstack');
if (fullStackMasteryIndex !== -1) {
    generalPortfolio.slides.splice(fullStackMasteryIndex, 1);
}

// Remove the Security-First slide
const securityFirstIndex = generalPortfolio.slides.findIndex(s => s.id === 'strength-security');
if (securityFirstIndex !== -1) {
    generalPortfolio.slides.splice(securityFirstIndex, 1);
}

// Remove the Scalability slide
const scalabilityIndex = generalPortfolio.slides.findIndex(s => s.id === 'strength-scale');
if (scalabilityIndex !== -1) {
    generalPortfolio.slides.splice(scalabilityIndex, 1);
}

// Remove the Problem Solving & Cost Optimization slide
const problemSolvingIndex = generalPortfolio.slides.findIndex(s => s.id === 'strength-solving');
if (problemSolvingIndex !== -1) {
    generalPortfolio.slides.splice(problemSolvingIndex, 1);
}

// Remove the Perfect Match slide
const alignmentIndex = generalPortfolio.slides.findIndex(s => s.id === 'alignment');
if (alignmentIndex !== -1) {
    generalPortfolio.slides.splice(alignmentIndex, 1);
}

// Remove the What I Bring slide
const whatIBringIndex = generalPortfolio.slides.findIndex(s => s.id === 'what-i-bring');
if (whatIBringIndex !== -1) {
    generalPortfolio.slides.splice(whatIBringIndex, 1);
}

// Remove the Logistics slide
const logisticsIndex = generalPortfolio.slides.findIndex(s => s.id === 'logistics');
if (logisticsIndex !== -1) {
    generalPortfolio.slides.splice(logisticsIndex, 1);
}

// Video URLs base path
const videoBasePath = 'https://storage.googleapis.com/wagnersilva-eu-assets/portfolio-videos';

// Add video to the first slide (title slide)
const firstSlideVideo = `${videoBasePath}/01_FIRST_VIDEO.mp4`;
const firstSlideTranscript = `Hey, thank you so much for being here and taking the time to go through my portfolio. I've curated 12 projects that demonstrate all my technical and soft skills and how adaptable I can be to the company goals. These are all real systems, and they are just a glimpse of the projects that I've built and maintained. Over the past seven, eight years, these systems, they are running in production up to this current date. Let's walk through them.`;
const firstSlideSubtitles = '/video-transcripts/01_FIRST_VIDEO.vtt';
if (generalPortfolio.slides.length > 0) {
    generalPortfolio.slides[0].videoUrl = firstSlideVideo;
    generalPortfolio.slides[0].videoPosition = 'br';
    generalPortfolio.slides[0].videoTranscript = firstSlideTranscript;
    generalPortfolio.slides[0].videoSubtitles = firstSlideSubtitles;
    generalPortfolio.slides[0].videoPosterTime = 10; // Show frame at 10 seconds as thumbnail
}

// Project 1: Page Builder Platform
const firstProjectSlide = generalPortfolio.slides.find(s => s.id.startsWith('project-'));
if (firstProjectSlide) {
    firstProjectSlide.videoUrl = `${videoBasePath}/PROJECT_1.mp4`;
    firstProjectSlide.videoPosition = 'tr';
    firstProjectSlide.videoSubtitles = '/video-transcripts/PROJECT_1.vtt';
    firstProjectSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_1.md';
}

// Project 2: RAG System
const ragProjectSlide = generalPortfolio.slides.find(s => s.id === 'project-rag-system');
if (ragProjectSlide) {
    ragProjectSlide.videoUrl = `${videoBasePath}/PROJECT_2.mp4`;
    ragProjectSlide.videoPosition = 'tr';
    ragProjectSlide.videoSubtitles = '/video-transcripts/PROJECT_2.vtt';
    ragProjectSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_2.md';
}

// Project 3: Tri-directional Sync
const triSyncSlide = generalPortfolio.slides.find(s => s.id === 'project-tri-directional-sync');
if (triSyncSlide) {
    triSyncSlide.videoUrl = `${videoBasePath}/PROJECT_3.mp4`;
    triSyncSlide.videoPosition = 'tr';
    triSyncSlide.videoSubtitles = '/video-transcripts/PROJECT_3.vtt';
    triSyncSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_3.md';
}

// Project 4: Cost Optimization
const costOptSlide = generalPortfolio.slides.find(s => s.id === 'project-cost-optimization');
if (costOptSlide) {
    costOptSlide.videoUrl = `${videoBasePath}/PROJECT_4.mp4`;
    costOptSlide.videoPosition = 'tr';
    costOptSlide.videoSubtitles = '/video-transcripts/PROJECT_4.vtt';
    costOptSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_4.md';
}

// Project 5: RLS Security
const rlsSlide = generalPortfolio.slides.find(s => s.id === 'project-rls-security');
if (rlsSlide) {
    rlsSlide.videoUrl = `${videoBasePath}/PROJECT_5.mp4`;
    rlsSlide.videoPosition = 'tr';
    rlsSlide.videoSubtitles = '/video-transcripts/PROJECT_5.vtt';
    rlsSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_5.md';
}

// Project 6: SFTP Architecture
const sftpSlide = generalPortfolio.slides.find(s => s.id === 'project-sftp-architecture');
if (sftpSlide) {
    sftpSlide.videoUrl = `${videoBasePath}/PROJECT_6.mp4`;
    sftpSlide.videoPosition = 'tr';
    sftpSlide.videoSubtitles = '/video-transcripts/PROJECT_6.vtt';
    sftpSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_6.md';
    sftpSlide.videoPosterTime = 10;
}

// Project 7: API Integration
const apiIntegrationSlide = generalPortfolio.slides.find(s => s.id === 'project-api-integration');
if (apiIntegrationSlide) {
    apiIntegrationSlide.videoUrl = `${videoBasePath}/PROJECT_7.mp4`;
    apiIntegrationSlide.videoPosition = 'tr';
    apiIntegrationSlide.videoSubtitles = '/video-transcripts/PROJECT_7.vtt';
    apiIntegrationSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_7.md';
}

// Project 8: CI/CD Pipeline
const cicdSlide = generalPortfolio.slides.find(s => s.id === 'project-cicd-pipeline');
if (cicdSlide) {
    cicdSlide.videoUrl = `${videoBasePath}/PROJECT_8.mp4`;
    cicdSlide.videoPosition = 'tr';
    cicdSlide.videoSubtitles = '/video-transcripts/PROJECT_8.vtt';
    cicdSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_8.md';
}

// Project 9: APISIX Gateway
const apisixSlide = generalPortfolio.slides.find(s => s.id === 'project-apisix-gateway');
if (apisixSlide) {
    apisixSlide.videoUrl = `${videoBasePath}/PROJECT_9.mp4`;
    apisixSlide.videoPosition = 'tr';
    apisixSlide.videoSubtitles = '/video-transcripts/PROJECT_9.vtt';
    apisixSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_9.md';
}

// Project 10: CDC Pipeline
const cdcSlide = generalPortfolio.slides.find(s => s.id === 'project-cdc-pipeline');
if (cdcSlide) {
    cdcSlide.videoUrl = `${videoBasePath}/PROJECT_10.mp4`;
    cdcSlide.videoPosition = 'tr';
    cdcSlide.videoSubtitles = '/video-transcripts/PROJECT_10.vtt';
    cdcSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_10.md';
}

// Project 11: Database Anonymization
const dbAnonSlide = generalPortfolio.slides.find(s => s.id === 'project-db-anonymization');
if (dbAnonSlide) {
    dbAnonSlide.videoUrl = `${videoBasePath}/PROJECT_11.mp4`;
    dbAnonSlide.videoPosition = 'tr';
    dbAnonSlide.videoSubtitles = '/video-transcripts/PROJECT_11.vtt';
    dbAnonSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_11.md';
}

// Project 12: SharePoint Leadership
const sharepointSlide = generalPortfolio.slides.find(s => s.id === 'project-sharepoint-leadership');
if (sharepointSlide) {
    sharepointSlide.videoUrl = `${videoBasePath}/PROJECT_12.mp4`;
    sharepointSlide.videoPosition = 'tr';
    sharepointSlide.videoSubtitles = '/video-transcripts/PROJECT_12.vtt';
    sharepointSlide.videoTranscriptUrl = '/video-transcripts/PROJECT_12.md';
}

// Find closing (Thank You) slide and remove video
const closingSlide = generalPortfolio.slides.find(s => s.id === 'closing');
if (closingSlide) {
    delete closingSlide.videoUrl;
    delete closingSlide.videoPosition;
    delete closingSlide.videoSubtitles;
    delete closingSlide.videoTranscript;
}
