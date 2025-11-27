import type { ProjectData } from '../types';

export const cdcPipeline: ProjectData = {
    id: 'cdc-pipeline',
    title: 'Real-Time CDC Pipeline',
    subtitle: 'ZNUNY/OTRS Analytics',
    category: 'data-integration',
    tags: ['MySQL', 'Datastream', 'BigQuery', 'Looker Studio'],
    context: [
        'Support team needed real-time analytics from operational MySQL DBs.',
        'Direct querying was not an option due to performance impact.',
        'Strict data minimization requirements for PII.'
    ],
    challenge: [
        'Real-time analytics from operational databases',
        'Data minimization (only replicate needed fields)',
        'Zero performance impact on production systems'
    ],
    solution: [
        'Datastream CDC for near-zero latency replication',
        'Selective column/table replication (40% of data)',
        'Real-time transformation in BigQuery'
    ],
    impact: [
        'Real-time support metrics with sub-second latency',
        'Enhanced data governance (less PII replicated)',
        '60% reduced data transfer costs'
    ],
    techs: ['MySQL', 'Datastream', 'BigQuery', 'Looker Studio'],
    mermaid: `flowchart LR
    A[(MySQL<br/>ZNUNY/OTRS)] -->|CDC Stream| B[Datastream]
    B -->|Selective Columns<br/>& Tables| C[(BigQuery)]
    C -->|Real-Time Query| D[Looker Studio<br/>Dashboards]

    N1>Near-Zero Latency<br/>Replication] -.-> B
    N2>Data Minimization<br/>for Compliance] -.-> B

    style A fill:#fee2e2,stroke:#ef4444,stroke-width:2px
    style B fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style C fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style D fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style N1 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style N2 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px`
};
