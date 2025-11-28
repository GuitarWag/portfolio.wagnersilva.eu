import type { ProjectData } from '../types';

export const sftpArchitecture: ProjectData = {
    id: 'sftp-architecture',
    title: 'Reusable SFTP Architecture',
    subtitle: 'Zero Data Loss for Global Clients',
    category: 'data-integration',
    tags: ['Python', 'SFTP', 'Cloud Run', 'Dataflow', 'BigQuery', 'VPC Connector', 'Cloud NAT'],
    context: [
        'Global electronics companies needed to sync financial product data.',
        'Zero data loss tolerance for payment/rebate information.',
        'Opportunity to build a reusable architecture for multiple clients.'
    ],
    challenge: [
        'Zero data loss tolerance (financial/payment data)',
        'Multiple global clients with similar SFTP needs',
        'Complex cross-infrastructure connectivity'
    ],
    solution: [
        'Reusable Python SFTP client library (config-driven)',
        'Cloud Run Jobs + Dataflow for validation & processing',
        'Comprehensive validation pipelines (row counts, checksums)'
    ],
    impact: [
        'ZERO data loss on financial records',
        '70% faster development for subsequent clients',
        'Reusable architecture deployed for multiple global clients'
    ],
    techs: ['Python', 'SFTP', 'Cloud Run Jobs', 'Dataflow', 'BigQuery', 'VPC Connector', 'Cloud NAT'],
    mermaid: `flowchart LR
    A[SFTP Servers<br/>Global Clients] -->|Static IP<br/>Allowlisted| V[VPC Connector<br/>+ Cloud NAT]
    V -->|Fetch Files| B[Cloud Run Jobs<br/>Python Library]
    B -->|Validated Files| C[Dataflow<br/>Pipeline]
    C -->|Parallel Load| D[(BigQuery)]

    N1>Static Outbound IP<br/>for Client Allowlist] -.-> V
    N2>Reusable SFTP<br/>Client Library] -.-> B
    N3>Zero Data Loss<br/>Guarantee] -.-> C

    style A fill:#fee2e2,stroke:#ef4444,stroke-width:2px
    style V fill:#f3e8ff,stroke:#9333ea,stroke-width:2px
    style B fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style C fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style D fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style N1 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style N2 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style N3 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px`
};
