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
        'System Design', 'Architecture Patterns', 'Microservices', 'Serverless', 'Event-Driven Architecture', 'Cost Optimization'
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

// Add video to the first slide and first project
const placeholderVideo = 'https://storage.googleapis.com/wagnersilva-eu-assets/placeholder.mp4';
if (stockholmFullPortfolio.slides.length > 0) {
    stockholmFullPortfolio.slides[0].videoUrl = placeholderVideo;
}
// Find first project slide and add video
const firstProjectSlide = stockholmFullPortfolio.slides.find(s => s.id.startsWith('project-'));
if (firstProjectSlide) {
    firstProjectSlide.videoUrl = placeholderVideo;
    firstProjectSlide.videoPosition = 'tr';
}

// Find second project slide (rag-system) and add video
const ragProjectSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-rag-system');
if (ragProjectSlide) {
    ragProjectSlide.videoUrl = placeholderVideo;
    ragProjectSlide.videoPosition = 'br';
}

// Find tri-directional-sync project and add video
const triSyncSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-tri-directional-sync');
if (triSyncSlide) {
    triSyncSlide.videoUrl = placeholderVideo;
    triSyncSlide.videoPosition = 'br';
}

// Find cost-optimization project and add video
const costOptSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-cost-optimization');
if (costOptSlide) {
    costOptSlide.videoUrl = placeholderVideo;
    costOptSlide.videoPosition = 'tr';
}

// Find rls-security project and add video
const rlsSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-rls-security');
if (rlsSlide) {
    rlsSlide.videoUrl = placeholderVideo;
    rlsSlide.videoPosition = 'tr';
}

// Find sftp-architecture project and add video
const sftpSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-sftp-architecture');
if (sftpSlide) {
    sftpSlide.videoUrl = placeholderVideo;
    sftpSlide.videoPosition = 'tr';
}

// Find api-integration project and add video
const apiSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-api-integration');
if (apiSlide) {
    apiSlide.videoUrl = placeholderVideo;
    apiSlide.videoPosition = 'bl';
}

// Find cicd-pipeline project and add video
const cicdSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-cicd-pipeline');
if (cicdSlide) {
    cicdSlide.videoUrl = placeholderVideo;
    cicdSlide.videoPosition = 'br';
}

// Find apisix-gateway project and add video
const apisixSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-apisix-gateway');
if (apisixSlide) {
    apisixSlide.videoUrl = placeholderVideo;
    apisixSlide.videoPosition = 'tr';
}

// Find cdc-pipeline project and add video
const cdcSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-cdc-pipeline');
if (cdcSlide) {
    cdcSlide.videoUrl = placeholderVideo;
    cdcSlide.videoPosition = 'tr';
}

// Find db-anonymization project and add video
const dbAnonSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-db-anonymization');
if (dbAnonSlide) {
    dbAnonSlide.videoUrl = placeholderVideo;
    dbAnonSlide.videoPosition = 'tr';
}

// Find sharepoint-leadership project and add video
const leadershipSlide = stockholmFullPortfolio.slides.find(s => s.id === 'project-sharepoint-leadership');
if (leadershipSlide) {
    leadershipSlide.videoUrl = placeholderVideo;
    leadershipSlide.videoPosition = 'tr';
}
