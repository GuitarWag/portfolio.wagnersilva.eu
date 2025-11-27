import type { ProjectData } from '../types';

export const dbAnonymization: ProjectData = {
    id: 'db-anonymization',
    title: 'On-Demand Database Anonymization',
    subtitle: 'Safe Development & Testing with Production-Quality Data',
    category: 'security',
    tags: ['Python', 'SQL', 'Cloud SQL', 'Cloud Storage', 'Terraform', 'GCE'],
    context: [
        'Developers need fresh, realistic data on-demand.',
        'Cannot expose production PII/sensitive data.',
        'Need ability to refresh environments whenever needed.'
    ],
    challenge: [
        'Developers need fresh, realistic data on-demand',
        'Cannot expose production PII/sensitive data',
        'Need ability to refresh environments whenever needed'
    ],
    solution: [
        'On-demand snapshot and anonymization tool (manual trigger)',
        'Python-based PII masking maintaining referential integrity',
        'Creates completely new database instances for dev/staging'
    ],
    impact: [
        'High-quality testing with realistic, fresh data',
        'Full data security compliance with zero PII exposure',
        'Fast environment provisioning (< 2 hours for full refresh)'
    ],
    techs: ['Python', 'SQL', 'Cloud SQL', 'Cloud Storage', 'Firewall', 'GCE', 'Terraform'],
    mermaid: `flowchart LR
    A[(Cloud Storage<br/>MySQL Backup)] -->|Load Backup| B[New GCE VM<br/>via Terraform]
    B -->|Verification| C{Valid?}
    C -->|Yes| D[Apply Firewall<br/>Rules]
    D -->|Update Config| E[Staging Servers]
    D -->|Enable Access| F[Developers]

    N1>Anonymize &<br/>Generalize] -.-> B
    N2>PII Masking<br/>Referential Integrity] -.-> B

    style A fill:#fee2e2,stroke:#ef4444,stroke-width:2px
    style B fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style C fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style D fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style E fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style F fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style N1 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style N2 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px`
};
