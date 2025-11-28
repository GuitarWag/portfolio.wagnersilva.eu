import type { ProjectData } from '../types';

export const cicdPipeline: ProjectData = {
    id: 'cicd-pipeline',
    title: 'CI/CD Pipeline Migration',
    subtitle: 'Jenkins to Cloud Build',
    category: 'devops',
    tags: ['Cloud Build', 'Docker', 'Terraform', 'Jenkins', 'CI/CD', 'DevOps'],
    context: [
        'On-premises Jenkins was becoming a bottleneck and maintenance burden.',
        '120+ different builds running in production alone.',
        'Needed cloud-native solution with better scalability and reliability.'
    ],
    challenge: [
        'Migrate 120+ production builds from on-prem Jenkins to Cloud Build',
        'Maintain zero downtime during migration',
        'Ensure consistency across dev, staging, and production environments'
    ],
    solution: [
        'Phased migration from Jenkins to Cloud Build',
        'Docker containerization for all apps',
        'Infrastructure as Code (Terraform) for provisioning'
    ],
    impact: [
        'Successfully migrated 120+ builds to cloud-native CI/CD',
        'Eliminated on-prem Jenkins maintenance overhead',
        'Improved scalability and developer productivity'
    ],
    techs: ['Cloud Build', 'Docker', 'Terraform', 'Jenkins', 'CI/CD', 'DevOps']
};
