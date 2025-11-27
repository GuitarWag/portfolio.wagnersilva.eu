import type { ProjectData } from '../types';

export const triDirectionalSync: ProjectData = {
    id: 'tri-directional-sync',
    title: 'Tri-Directional Real-Time Sync',
    subtitle: 'Salesforce, Internal DB, TalentLMS',
    category: 'orchestration',
    tags: ['TypeScript', 'Cloud Run', 'Salesforce API', 'REST', 'Cloud SQL'],
    context: [
        'Global solar company needed to sync data across Salesforce, TalentLMS, and internal systems.',
        'Manual entry was causing errors and wasting 20+ hours/week.',
        'Required conflict resolution for simultaneous updates across time zones.'
    ],
    challenge: [
        'Keep 3 systems in perfect sync with bidirectional flow',
        'Handle concurrent updates & conflicts across time zones',
        'Process 15,000+ records daily with <5 min latency'
    ],
    solution: [
        'TypeScript orchestration engine on Cloud Run Jobs',
        'Conflict detection logic with priority rules',
        'Event-driven architecture with comprehensive logging'
    ],
    impact: [
        'Single source of truth across all platforms',
        '20+ hours/week saved from manual data entry',
        '99.9% sync success rate with auto-recovery'
    ],
    techs: ['TypeScript', 'Cloud Run Jobs', 'Salesforce API', 'TalentLMS API', 'REST'],
    mermaid: `flowchart LR
    A[Salesforce<br/>Pardot] <-->|Bi-Sync| B[Cloud Run Jobs<br/>Orchestrator]
    B <-->|Bi-Sync| C[(Internal DB<br/>Cloud SQL)]
    B <-->|Bi-Sync| D[TalentLMS]

    N1>Conflict Detection<br/>& Resolution] -.-> B
    N2>Priority Rules<br/>& State Management] -.-> B

    style A fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style B fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style C fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style D fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style N1 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style N2 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px`
};
