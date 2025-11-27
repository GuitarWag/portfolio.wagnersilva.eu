import { buildPresentation, type PresentationBuildConfig } from '../composer';
import type { PresentationData } from '@/lib/types';

const config: PresentationBuildConfig = {
    id: 'data-engineer-generic',
    roleType: 'data-engineer',
    target: {
        companyName: 'Your Company',
        roleName: 'Senior Data Engineer',
        roleType: 'data-engineer',
        requirements: [
            '7+ years Data Engineer experience',
            'Strong GCP (BigQuery, Cloud Run, etc.)',
            'SQL proficiency & Python/TypeScript',
            'Terraform & CI/CD',
            'NoSQL & RDBMS experience'
        ],
        myExperience: [
            'With 7+ years delivering production data systems and a proven track record of impact, I bring the experience you need—and the curiosity to master whatever comes next.'
        ]
    },
    // Sectioned projects for data engineer
    sections: [
        {
            title: 'Security & Governance',
            subtitle: 'Protecting Data at Every Layer',
            projectIds: ['rls-security', 'db-anonymization', 'cdc-pipeline']
        },
        {
            title: 'Data Integration & Pipelines',
            subtitle: 'Scalable & Intelligent Data Flows',
            projectIds: ['sftp-architecture', 'api-integration']
        },
        {
            title: 'Multi-System Orchestration',
            subtitle: 'Synchronizing Global Operations',
            projectIds: ['tri-directional-sync']
        },
        {
            title: 'AI & Innovation',
            subtitle: 'Enterprise AI Platform',
            projectIds: ['rag-system']
        },
        {
            title: 'Enterprise Leadership',
            subtitle: 'Cross-Functional Team Coordination',
            projectIds: ['sharepoint-leadership']
        },
        {
            title: 'Infrastructure & Cost Optimization',
            subtitle: 'Smart Infrastructure Decisions',
            projectIds: ['cost-optimization', 'apisix-gateway']
        }
    ],
    includeTechStack: true,
    includeCostImpact: true,
    includeAchievements: true,
    includeWhyStockholm: true,
};

export const dataEngineerGeneric: PresentationData = buildPresentation(config);
