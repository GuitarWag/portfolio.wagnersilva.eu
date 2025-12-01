import type { ProjectData } from '../types';

export const portfolioSystem: ProjectData = {
    id: 'portfolio-system',
    title: 'Interactive Portfolio System',
    subtitle: 'Data-Driven Presentation Platform with AI Narration',
    category: 'full-stack',
    tags: ['Next.js', 'React', 'TypeScript', 'Cloud Run', 'Gemini AI', 'PDF Export'],
    context: [
        'Traditional portfolios are static PDFs that fail to showcase technical depth and personality.',
        'Recruiters spend seconds scanning resumes - needed an engaging, memorable format.',
        'Wanted to demonstrate full-stack skills through the portfolio itself (meta-project).'
    ],
    challenge: [
        'Build a presentation system that exports to professional PDF format',
        'Integrate AI voice narration for each project slide',
        'Create reusable data-driven architecture for multiple presentation variants'
    ],
    solution: [
        'Next.js 15 with TypeScript - data-driven slide generation from structured JSON',
        'Gemini AI integration for TL;DR summaries & voice narration',
        'Multi-layout system (9 layouts) with Mermaid diagrams & ReactFlow visualizations'
    ],
    impact: [
        'Self-referential: The portfolio showcases the skills used to build it',
        'AI-powered: Gemini generates project summaries and narration on-demand',
        'Production-ready: Deployed on Cloud Run with automated CI/CD via Cloud Build'
    ],
    techs: ['Next.js 15', 'React', 'TypeScript', 'Tailwind CSS', 'Cloud Run', 'Gemini AI', 'Mermaid'],
    mermaid: `flowchart LR
    Users[👥 Recruiters &<br/>Hiring Managers]

    LoadBalancer[🔒 GCE Load Balancer VM<br/>Caddy + CrowdSec<br/>SSL Termination]

    CloudRun[☁️ Cloud Run<br/>Next.js 15 App<br/>Europe-North1]

    subgraph AI["🤖 AI Features"]
        TLDR[Gemini TL;DR<br/>Project Summaries]
        Voice[AI Voice Narration<br/>Per-Slide Audio]
        Assistant[AI Assistant<br/>On-Screen Helper]
    end

    Build[🚀 Cloud Build<br/>Automated CI/CD<br/>Deployments]

    Firestore[(📊 Firestore<br/>Feedback Storage)]

    Users -->|HTTPS| LoadBalancer
    LoadBalancer -->|portfolio.wagnersilva.eu| CloudRun
    CloudRun --> AI
    AI --> TLDR
    AI --> Voice
    AI --> Assistant

    Build -.->|Deploy| CloudRun
    CloudRun -.->|Store| Firestore

    style Users fill:#fce7f3,stroke:#db2777,stroke-width:2px
    style LoadBalancer fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style CloudRun fill:#e0e7ff,stroke:#6366f1,stroke-width:2px
    style TLDR fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style Voice fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style Assistant fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style Build fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style Firestore fill:#f3e8ff,stroke:#9333ea,stroke-width:2px`
};
