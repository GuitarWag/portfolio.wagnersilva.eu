import type { ProjectData } from '../types';

export const pageBuilder: ProjectData = {
    id: 'page-builder',
    title: 'White-Label Page Builder Platform',
    subtitle: 'Global Self-Service Website Platform',
    category: 'full-stack',
    tags: ['React', 'TypeScript', 'Node.js', 'Cloud Run', 'Cloud SQL', 'BigQuery'],
    context: [
        'A worldwide solar panel company needed to empower 3rd-party installers with professional websites.',
        'Installers lacked technical skills, requiring a zero-code, self-service solution.',
        'Platform needed to support global operations (EMEA, APAC, Americas) and maintain brand consistency.'
    ],
    challenge: [
        'Enable non-technical installers to create websites instantly',
        'Support global operations with localization',
        'Handle file uploads & deploy without manual intervention'
    ],
    solution: [
        'React-based drag-and-drop page builder with real-time preview',
        'Node.js/TypeScript API on Cloud Run for backend logic',
        'Automated one-click deployment pipeline to global CDN'
    ],
    impact: [
        'Global B2B platform serving hundreds of installers',
        'Zero-touch website creation (minutes vs weeks)',
        'Complete full-stack ownership (UI + API + Infra)'
    ],
    techs: ['React', 'TypeScript', 'Node.js', 'Cloud Run', 'Cloud SQL', 'BigQuery'],
    mermaid: `flowchart LR
    subgraph Users
        Installer[Solar Installer]
        Customer[End Customer]
    end

    subgraph Apps
        SSO[External SSO]
        Editor[Editor Web App]
        Renderer[Page Renderer App]
    end

    subgraph Backend
        API[REST API<br/>Cloud Run]
        DB[(Cloud SQL)]
    end

    subgraph Analytics
        BQ[(BigQuery)]
        GA[Google Analytics]
        Looker[Looker Studio]
    end

    Installer -->|Login| SSO
    SSO -->|Auth| Editor
    Installer -->|Build & Publish| Editor
    Editor -->|Save Config| API
    API <-->|Read/Write| DB

    Customer -->|Visit Page| Renderer
    Renderer -->|Fetch Content| API

    DB -.->|Stream Usage| BQ
    Renderer -.->|User Events| GA

    BQ --> Looker
    GA --> Looker

    style Installer fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style Customer fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style SSO fill:#f3e8ff,stroke:#9333ea,stroke-width:2px
    style Editor fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style Renderer fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style API fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style DB fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style BQ fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style Looker fill:#fce7f3,stroke:#db2777,stroke-width:2px
    style GA fill:#ffedd5,stroke:#ea580c,stroke-width:2px`
};
