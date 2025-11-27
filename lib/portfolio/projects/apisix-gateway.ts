import type { ProjectData } from '../types';

export const apisixGateway: ProjectData = {
    id: 'apisix-gateway',
    title: 'APISIX API Gateway',
    subtitle: 'Enterprise Security at Zero Cost',
    category: 'infrastructure',
    tags: ['APISIX', 'Crowdsec', 'GCE', 'Prometheus', 'Grafana'],
    context: [
        'Cloud Armor costs (€36K/yr) were unsustainable.',
        'Needed equivalent DDoS protection and WAF capabilities.',
        'Required better observability for SRE teams.'
    ],
    challenge: [
        'Replace expensive Cloud Armor without compromising security',
        'Improve observability and SRE capabilities',
        'Ensure zero downtime during migration'
    ],
    solution: [
        'Open-source APISIX Gateway on GCE Managed Groups',
        'Crowdsec integration for community threat intelligence',
        'Prometheus/Grafana for deep observability'
    ],
    impact: [
        '€36,000 annual savings (100% cost reduction)',
        'Enhanced security with real-time community intel',
        '10x improvement in observability metrics'
    ],
    techs: ['APISIX', 'Crowdsec', 'GCE', 'MIG', 'Prometheus', 'Grafana'],
    mermaid: `flowchart LR
    A[Internet<br/>Traffic] -->|Requests| B[APISIX<br/>Gateway]
    B -->|Threat Check| C[Crowdsec<br/>Threat Intel]
    C -->|Block/Allow| B
    B -->|Filtered Traffic| D[Backend<br/>Services]
    D -->|Metrics| E[Prometheus<br/>+ Grafana]
    B -->|Metrics| E

    N1>Community Threat<br/>Intelligence] -.-> C
    N2>€36K/yr Savings<br/>vs Cloud Armor] -.-> B

    style A fill:#fee2e2,stroke:#ef4444,stroke-width:2px
    style B fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style C fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style D fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style E fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style N1 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style N2 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px`
};
