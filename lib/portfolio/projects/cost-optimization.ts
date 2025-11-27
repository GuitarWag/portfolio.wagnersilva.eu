import type { ProjectData } from '../types';

export const costOptimization: ProjectData = {
    id: 'cost-optimization',
    title: 'GCP Cost Optimization',
    subtitle: '€15K Annual Savings',
    category: 'infrastructure',
    tags: ['Redis', 'BigQuery', 'Cloud Monitoring', 'Terraform'],
    context: [
        'GCP costs were rising 30% YoY, threatening sustainability.',
        'Needed a strategy to reduce costs without impacting performance.',
        'Goal: Create a cost-conscious engineering culture.'
    ],
    challenge: [
        'Reduce rising GCP costs without performance degradation',
        'Optimize across multiple projects simultaneously',
        'Establish measurable, repeatable optimization processes'
    ],
    solution: [
        'Redis (Memorystore) caching layer (60% query reduction)',
        'BigQuery partitioning & clustering (70% less scanned)',
        'Right-sizing compute resources & Spot VMs'
    ],
    impact: [
        '€15,000 annual savings (30% reduction)',
        'Improved application performance via caching',
        'Established automated cost monitoring & alerts'
    ],
    techs: ['Redis', 'BigQuery', 'Cloud Monitoring', 'Terraform'],
    detailSections: [
        {
            title: 'Active Monitoring',
            items: [
                'Real-time cost tracking dashboards',
                'Budget alerts and anomaly detection',
                'Cost allocation by project/team',
                'Weekly cost review meetings'
            ]
        },
        {
            title: 'Right-Sizing',
            items: [
                'Cloud SQL: Reduced instance tiers',
                'GKE: Node pool right-sizing & autoscaling',
                'Storage: Moved archival to Coldline',
                'Eliminated over-provisioning'
            ]
        },
        {
            title: 'Service Optimization',
            items: [
                'Cloud Run vs Functions selection',
                'Batch jobs → Cloud Run Jobs',
                'Dev environments: Spot VMs (60% off)',
                'Committed Use Discounts applied'
            ]
        },
        {
            title: 'Code & Queries',
            items: [
                'BigQuery partitioning & clustering',
                'Redis caching layer for APIs',
                'Optimized data retention policies',
                'Query optimization: 70% less scanned'
            ]
        }
    ]
};
