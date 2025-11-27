import type { ProjectData } from '../types';

export const apiIntegration: ProjectData = {
    id: 'api-integration',
    title: 'Smart API Integration',
    subtitle: 'Pascom PBX Analytics',
    category: 'data-integration',
    tags: ['Python', 'Cloud Run', 'BigQuery', 'Cloud Scheduler'],
    context: [
        'Call center needed real-time analytics from Pascom PBX.',
        'API was severely limited: no filtering, no pagination, returned ALL data.',
        'Needed frequent syncs without duplicating data or overloading API.'
    ],
    challenge: [
        'Work around severe API limitations (no filter/pagination)',
        'Process 10K+ records frequently without duplicates',
        'Minimize BigQuery costs and API load'
    ],
    solution: [
        'Python sync job with local timestamp filtering',
        'Hash-based deduplication to identify new records',
        'Efficient delta loading to BigQuery'
    ],
    impact: [
        'Real-time analytics operational (15-30 min freshness)',
        '99.5% data processing efficiency',
        '80% reduced BigQuery insert costs'
    ],
    techs: ['Python', 'Cloud Run Jobs', 'Cloud Scheduler', 'BigQuery'],
    mermaid: `flowchart LR
    A[Cloud Scheduler] -->|Every 15-30 min| B[Cloud Run Jobs<br/>Python]
    B -->|Fetch ALL| C[Pascom PBX<br/>API]
    C -->|5-10K Records| B
    B -->|Only NEW Rows| D[(BigQuery)]

    N1>Timestamp Filter<br/>Past 48h] -.-> B
    N2>Hash-Based<br/>Deduplication] -.-> B
    N3>~50 New Records<br/>per Run] -.-> D

    style A fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style B fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style C fill:#fee2e2,stroke:#ef4444,stroke-width:2px
    style D fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style N1 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style N2 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style N3 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px`
};
