import type { ProjectData } from '../types';

export const rlsSecurity: ProjectData = {
    id: 'rls-security',
    title: 'Row-Level Security System',
    subtitle: 'Secure Public Reporting',
    category: 'security',
    tags: ['Python', 'Cloud Run', 'Looker Studio', 'BigQuery', 'JWT'],
    context: [
        'Client needed to embed Looker Studio reports in a customer portal.',
        'Requirement: Public access (no Google login) but with strict data isolation.',
        'Each customer must ONLY see their own data.'
    ],
    challenge: [
        'Publicly accessible reports with row-level security',
        'No Google account login allowed for end-users',
        'Scalable to thousands of concurrent users'
    ],
    solution: [
        'Python reverse proxy injecting JWT-based secrets',
        'BigQuery views with row-level filtering based on secrets',
        'Seamless integration with customer portal auth'
    ],
    impact: [
        'Secure public reporting with zero data exposure',
        'Seamless user experience (no login friction)',
        'Scalable to thousands of concurrent users'
    ],
    techs: ['Python', 'Cloud Run', 'Looker Studio', 'BigQuery', 'JWT'],
    mermaid: `flowchart LR
    A[Platform with<br/>Embedded Report] -->|Custom URL + JWT| B[Cloud Run<br/>Reverse Proxy]
    B -->|URL Params with<br/>Filter Credentials| C[Looker Studio<br/>Report]
    C -->|Row-Filtered Query| D[(BigQuery<br/>Tables & Views)]
    D -->|Filtered Results| C
    C -->|Rendered Report| B
    B -->|Proxied Response| A

    N1>Validate JWT<br/>Inject Secrets] -.-> B

    style A fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style B fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style C fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style D fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style N1 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px`
};
