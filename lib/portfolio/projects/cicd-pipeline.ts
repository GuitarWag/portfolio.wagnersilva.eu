import type { ProjectData } from '../types';

export const cicdPipeline: ProjectData = {
    id: 'cicd-pipeline',
    title: 'CI/CD Pipeline Optimization',
    subtitle: 'DevOps for 50+ Applications',
    category: 'devops',
    tags: ['GitLab CI', 'Docker', 'Terraform', 'Cloud Build'],
    context: [
        'Managing deployments for 50+ applications was manual and slow.',
        'Needed a standardized, automated approach to improve delivery speed.',
        'Required consistency across dev, staging, and production environments.'
    ],
    challenge: [
        'Automate deployments for 50+ diverse applications',
        'Reduce delivery time and manual errors',
        'Ensure consistency and reliability across environments'
    ],
    solution: [
        'Standardized GitLab CI/CD pipelines',
        'Docker containerization for all apps',
        'Infrastructure as Code (Terraform) for provisioning'
    ],
    impact: [
        '30% reduction in delivery time',
        'Eliminated manual deployment errors',
        'Improved developer productivity and feedback loops'
    ],
    techs: ['GitLab CI', 'Docker', 'Terraform', 'Cloud Build']
};
