import type { ProjectData } from '../types';

export const costOptimization: ProjectData = {
    id: 'cost-optimization',
    title: 'GCP Cost Optimization',
    subtitle: '€15K Annual Savings',
    category: 'infrastructure',
    tags: ['Redis', 'BigQuery', 'Cloud Monitoring', 'Terraform'],
    context: [
        'GCP costs were rising 30% YoY, threatening sustainability.',
        'No visibility into per-app costs - resources lacked proper labeling.',
        'Goal: Create a cost-conscious engineering culture.'
    ],
    challenge: [
        'Reduce rising GCP costs without performance degradation',
        'Track costs per application (Storage, VMs, Cloud Run, Cloud Run Jobs)',
        'Establish measurable, repeatable optimization processes'
    ],
    solution: [
        'Implemented resource labeling across all GCP services for cost allocation',
        'Artifact Registry cleanup, storage class optimization, log ingestion reduction',
        'CPU/RAM right-sizing & Committed Use Discounts (CUDs) where appropriate'
    ],
    impact: [
        '€15,000 annual savings (30% reduction)',
        'Full cost visibility per application via billing labels',
        'Established automated cost monitoring & alerts'
    ],
    techs: ['Redis', 'BigQuery', 'Cloud Monitoring', 'Terraform'],
    detailSections: [
        {
            title: 'Resource Labeling',
            items: [
                'Labels on Storage buckets, VMs, Cloud Run',
                'Cloud Run Jobs, Cloud SQL tagged by app',
                'Cost allocation reports per application',
                'Billing exports to BigQuery for analysis'
            ]
        },
        {
            title: 'Resource Cleanup',
            items: [
                'Artifact Registry: Auto-delete old images',
                'Buckets: Correct storage class per use case',
                'Reduced unnecessary log ingestion',
                'Eliminated orphaned resources'
            ]
        },
        {
            title: 'Right-Sizing',
            items: [
                'CPU/RAM optimization across services',
                'Cloud SQL instance tier reduction',
                'GKE node pool autoscaling',
                'Dev environments: Spot VMs'
            ]
        },
        {
            title: 'Strategic Purchases',
            items: [
                'Committed Use Discounts (CUDs)',
                'Reserved capacity where predictable',
                'Storage class lifecycle policies',
                'BigQuery slot reservations'
            ]
        }
    ]
};
