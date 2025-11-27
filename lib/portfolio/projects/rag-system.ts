import type { ProjectData } from '../types';

export const ragSystem: ProjectData = {
    id: 'rag-system',
    title: 'Enterprise RAG + AI Agents',
    subtitle: 'Organization-Wide AI Platform',
    category: 'ai-ml',
    tags: ['React', 'TypeScript', 'Python', 'GKE', 'Neo4j', 'Qdrant', 'Vertex AI', 'FastAPI', 'tRPC'],
    context: [
        'Organization needed cost-effective, secure AI access for 500+ employees.',
        'Individual subscriptions were too expensive (€50K/yr) and insecure.',
        'Required access to internal company documents with role-based security.'
    ],
    challenge: [
        'Reduce costs vs individual AI subscriptions',
        'Ensure 100% data security (no external leakage)',
        'Implement role-based access to sensitive documents'
    ],
    solution: [
        'Multi-database RAG (Qdrant, Neo4j, Postgres)',
        'GKE microservices with Vertex AI (Gemini) integration',
        'Cloud IAP for seamless Google Workspace SSO'
    ],
    impact: [
        '85% cost reduction (~€42.5K annual savings)',
        '500+ active users, 10K+ daily queries',
        'Sub-2 second response times with high security'
    ],
    techs: ['Python', 'TypeScript', 'FastAPI', 'tRPC', 'Neo4j', 'PostgreSQL', 'Qdrant', 'Meilisearch', 'MinIO', 'Vertex AI', 'GKE'],
    mermaid: `flowchart LR
    A[Clients<br/>Next.js + API] --> B1[API Service<br/>tRPC/Node]
    A --> B2[Ingestion<br/>FastAPI/Python]
    B1 --> C[(Data Stores<br/>Neo4j • Qdrant<br/>Meilisearch • PostgreSQL)]
    B2 --> C
    B2 --> F[(MinIO<br/>Files)]
    B1 --> D[AI Providers<br/>Vertex AI • LLMs]
    B2 --> D

    N1>Hybrid Search] -.-> B1
    N2>Chunking] -.-> B2

    style A fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style B1 fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style B2 fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style C fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style F fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style D fill:#fee2e2,stroke:#ef4444,stroke-width:2px
    style N1 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style N2 fill:#fef9c3,stroke:#ca8a04,stroke-width:1px`
};
