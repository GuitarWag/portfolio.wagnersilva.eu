import type { PresentationData } from '../types';
import {
    Code2,
    Cloud,
    Database,
    Globe,
    Shield,
    Zap,
    TrendingDown,
    Users,
    Server,
    Lock,
    MapPin,
    Rocket,
    FileCheck,
    Calendar,
    Mail
} from 'lucide-react';

export const portfolioData: PresentationData = {
    id: 'portfolio-software-engineer',
    title: 'Full Stack Web Developer Application',
    slides: [
        // SLIDE 1: TITLE
        {
            id: 'title',
            title: 'Full Stack Web Developer Application',
            subtitle: 'Wagner Silva',
            layout: 'title-only',
            footer: '7+ Years Building Scalable Web Platforms',
            image: '/src/assets/wagner.png'
        },
        // SLIDE 2: AT A GLANCE
        {
            id: 'at-a-glance',
            title: 'At a Glance',
            layout: 'grid-cards',
            cards: [
                { icon: Code2, title: '7+ Years', value: 'Full Stack', description: 'TypeScript, React, Node.js' },
                { icon: Cloud, title: 'GCP Native', value: 'Cloud Expert', description: 'Primary platform throughout career' },
                { icon: TrendingDown, title: '€48K+', value: 'Cost Savings', description: 'Proven business impact' },
                { icon: Globe, title: 'Global Scale', value: 'Enterprise', description: 'EMEA, APAC, Americas' }
            ]
        },
        // SLIDE 3: WHY BAMBUSER
        {
            id: 'why-bambuser',
            title: 'Why Bambuser?',
            layout: 'bullets',
            content: [
                'Excited about video commerce innovation and real-time technologies',
                'Strong technical stack alignment (GCP, TypeScript, React)',
                'Opportunity to work on challenging real-time live video platforms',
                'Desire to learn from world-class engineers and open source contributors',
                'Committed to relocating to Stockholm (already eligible to work in Sweden)'
            ]
        },
        // SLIDE 4: TECH STACK OVERLAP
        {
            id: 'tech-stack',
            title: 'Tech Stack Overlap',
            subtitle: '7+ Years Professional Experience',
            layout: 'two-column',
            columns: [
                {
                    title: 'Core Stack',
                    content: [
                        'GCP (Cloud Run, Functions, AppEngine)',
                        'TypeScript/JavaScript (Primary Language)',
                        'React & Node.js (Extensive Production Use)',
                        'Databases (PostgreSQL, MySQL, BigQuery)'
                    ]
                },
                {
                    title: 'Systems & DevOps',
                    content: [
                        'Real-time Systems (Pub/Sub, CDC, WebSocket)',
                        'Docker, Kubernetes (GKE)',
                        'Git, GitLab CI/CD',
                        'Infrastructure as Code (Terraform)'
                    ]
                }
            ]
        },
        // SLIDE 5: FULL STACK CAPABILITIES
        {
            id: 'full-stack-caps',
            title: 'Full Stack Capabilities',
            layout: 'two-column',
            columns: [
                {
                    title: 'Frontend & Backend',
                    content: [
                        'React with TypeScript, Component Architecture',
                        'Performance Optimization, i18n/Localization',
                        'Node.js & TypeScript Microservices',
                        'Python for Data Processing',
                        'REST APIs & Serverless Architectures'
                    ]
                },
                {
                    title: 'Infrastructure & Data',
                    content: [
                        'GCP Serverless (Cloud Run, Functions)',
                        'Kubernetes (GKE), CI/CD Pipelines',
                        'Relational (PostgreSQL, MySQL)',
                        'NoSQL (Firestore, Bigtable)',
                        'Caching (Redis/Memorystore)'
                    ]
                }
            ]
        },
        // SLIDE 6: GCP EXPERTISE
        {
            id: 'gcp-expertise',
            title: 'GCP Expertise',
            subtitle: 'Primary Cloud Platform (7+ Years)',
            layout: 'grid-cards',
            cards: [
                { icon: Server, title: 'Compute', description: 'Cloud Run, Functions, GKE, GCE' },
                { icon: Database, title: 'Data', description: 'Cloud SQL, Firestore, BigQuery, Redis' },
                { icon: Zap, title: 'Messaging', description: 'Pub/Sub, Event Streaming' },
                { icon: Shield, title: 'Security', description: 'IAM, IAP, Secret Manager' }
            ]
        },
        // SLIDE 7: REAL-TIME SYSTEMS
        {
            id: 'real-time',
            title: 'Real-Time Systems Experience',
            layout: 'bullets',
            content: [
                'CDC pipelines with near-zero latency replication',
                'Pub/Sub event streaming for high-throughput messaging',
                'Tri-directional sync orchestration with conflict resolution',
                'WebSocket implementations for API gateways',
                'Real-time analytics with BigQuery streaming inserts',
                'High-performance caching strategies for sub-second response'
            ]
        },
        // SLIDE 8: AREAS FOR GROWTH
        {
            id: 'growth',
            title: 'Areas for Growth',
            layout: 'bullets',
            content: [
                'AWS Ecosystem: Eager to translate deep GCP knowledge to AWS',
                'Video Streaming Specifics: Excited to dive deep into HLS and WebRTC',
                'E-commerce Platforms: Quick learner ready to master WooCommerce/Shopify integrations',
                'Proven track record of quickly mastering new technologies when needed'
            ]
        },
        // SLIDE 9: PROJECT 1 - PAGE BUILDER
        {
            id: 'project-page-builder',
            title: 'White-Label Page Builder Platform',
            subtitle: 'Global Self-Service Website Platform',
            layout: 'project-detail',
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
        },
        // SLIDE 10: PROJECT 2 - RAG SYSTEM
        {
            id: 'project-rag',
            title: 'Enterprise RAG System',
            subtitle: 'Organization-Wide AI Platform',
            layout: 'project-detail',
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
            techs: ['React', 'TypeScript', 'Python', 'GKE', 'Neo4j', 'Qdrant', 'Vertex AI'],
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
        },
        // SLIDE 11: PROJECT 3 - SYNC
        {
            id: 'project-sync',
            title: 'Tri-Directional Real-Time Sync',
            subtitle: 'Salesforce, Internal DB, TalentLMS',
            layout: 'project-detail',
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
            techs: ['TypeScript', 'Cloud Run', 'Salesforce API', 'REST'],
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
        },
        // SLIDE 12: PROJECT 4 - COST OPT
        {
            id: 'project-cost',
            title: 'High-Performance Caching & Optimization',
            subtitle: '€15K Annual Savings',
            layout: 'project-detail',
            context: [
                'GCP costs were rising 30% YoY, threatening sustainability.',
                'Needed a strategy to reduce costs without impacting performance.',
                'Goal: Create a cost-conscious engineering culture.'
            ],
            challenge: [
                'Reduce rising GCP costs without performance degradation',
                'Optimize across multiple projects simultaneously',
                'Establish measurable, repeatable optimization processes'
            ],
            solution: [
                'Redis (Memorystore) caching layer (60% query reduction)',
                'BigQuery partitioning & clustering (70% less scanned)',
                'Right-sizing compute resources & Spot VMs'
            ],
            impact: [
                '€15,000 annual savings (30% reduction)',
                'Improved application performance via caching',
                'Established automated cost monitoring & alerts'
            ],
            techs: ['Redis', 'BigQuery', 'Cloud Monitoring', 'Terraform']
        },
        // SLIDE 13: PROJECT 5 - RLS
        {
            id: 'project-rls',
            title: 'Row-Level Security System',
            subtitle: 'Secure Public Reporting',
            layout: 'project-detail',
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
        },
        // SLIDE 14: PROJECT 6 - SFTP
        {
            id: 'project-sftp',
            title: 'Reusable SFTP Architecture',
            subtitle: 'Zero Data Loss for Global Clients',
            layout: 'project-detail',
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
                'Deployed successfully across 3 global regions'
            ],
            techs: ['Python', 'SFTP', 'Cloud Run', 'Dataflow', 'BigQuery'],
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
        },
        // SLIDE 15: PROJECT 7 - API
        {
            id: 'project-api',
            title: 'Smart API Integration',
            subtitle: 'Pascom PBX Analytics',
            layout: 'project-detail',
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
            techs: ['Python', 'Cloud Run', 'BigQuery', 'Hashing'],
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
        },
        // SLIDE 16: PROJECT 8 - CI/CD
        {
            id: 'project-cicd',
            title: 'CI/CD Pipeline Optimization',
            subtitle: 'DevOps for 50+ Applications',
            layout: 'project-detail',
            context: [
                'Managing deployments for 50+ applications was manual and slow.',
                'Needed a standardized, automated approach to improve delivery speed.',
                'Required consistency across dev, staging, and production environments.'
            ],
            challenge: [
                'Automate deployments for 50+ diverse applications',
                'Reduce delivery time and manual errors',
                'Ensure consistency and reliability across environments'
            ],
            solution: [
                'Standardized GitLab CI/CD pipelines',
                'Docker containerization for all apps',
                'Infrastructure as Code (Terraform) for provisioning'
            ],
            impact: [
                '30% reduction in delivery time',
                'Eliminated manual deployment errors',
                'Improved developer productivity and feedback loops'
            ],
            techs: ['GitLab CI', 'Docker', 'Terraform', 'Cloud Build']
        },
        // SLIDE 17: PROJECT 9 - APISIX
        {
            id: 'project-apisix',
            title: 'APISIX API Gateway',
            subtitle: 'Enterprise Security at Zero Cost',
            layout: 'project-detail',
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
            techs: ['APISIX', 'Crowdsec', 'GCE', 'Prometheus', 'Grafana'],
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
        },
        // SLIDE 18: PROJECT 10 - CDC
        {
            id: 'project-cdc',
            title: 'Real-Time CDC Pipeline',
            subtitle: 'ZNUNY/OTRS Analytics',
            layout: 'project-detail',
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
            techs: ['MySQL', 'Datastream', 'BigQuery', 'CDC'],
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
        },
        // SLIDE 19: CORE STRENGTHS - FULL STACK
        {
            id: 'strength-fullstack',
            title: 'Core Strength: Full-Stack Mastery',
            subtitle: 'Complete Ownership from UI to Infrastructure',
            layout: 'two-column',
            columns: [
                {
                    title: 'Frontend',
                    content: [
                        'React & TypeScript Excellence',
                        'Component-based Architecture',
                        'Performance Optimization',
                        'Modern Web Practices'
                    ]
                },
                {
                    title: 'Backend & Infra',
                    content: [
                        'Node.js & Python Services',
                        'Serverless & Microservices',
                        'GCP Native Infrastructure',
                        'CI/CD & DevOps'
                    ]
                }
            ]
        },
        // SLIDE 20: CORE STRENGTHS - SECURITY
        {
            id: 'strength-security',
            title: 'Core Strength: Security-First',
            subtitle: 'Enterprise-Grade Security by Default',
            layout: 'grid-cards',
            cards: [
                { icon: Lock, title: 'Zero Incidents', description: 'Across all projects' },
                { icon: Shield, title: 'Compliance', description: 'GDPR & Financial Data' },
                { icon: Users, title: 'Auth', description: 'JWT, SSO, IAM' },
                { icon: Database, title: 'Protection', description: 'Row-level Security' }
            ]
        },
        // SLIDE 21: CORE STRENGTHS - SCALABILITY
        {
            id: 'strength-scale',
            title: 'Core Strength: Scalability',
            subtitle: 'Proven at Global Scale',
            layout: 'grid-cards',
            cards: [
                { icon: Users, title: 'Millions', description: 'Users Served' },
                { icon: Globe, title: '3 Continents', description: 'Global Operations' },
                { icon: Zap, title: 'Sub-second', description: 'Response Times' },
                { icon: Server, title: '99.9%+', description: 'High Availability' }
            ]
        },
        // SLIDE 22: CORE STRENGTHS - PROBLEM SOLVING
        {
            id: 'strength-solving',
            title: 'Problem Solving & Cost Optimization',
            layout: 'two-column',
            columns: [
                {
                    title: 'Creative Solutions',
                    content: [
                        'API Limitation Workarounds',
                        'Security without Auth Barriers',
                        'Open Source Alternatives',
                        'Complex System Design'
                    ]
                },
                {
                    title: 'Business Impact',
                    content: [
                        '€48,000+ Total Annual Savings',
                        '€36K Cloud Armor Replacement',
                        '85% AI Cost Reduction',
                        'ROI-Driven Engineering'
                    ]
                }
            ]
        },
        // SLIDE 23: ALIGNMENT
        {
            id: 'alignment',
            title: 'Perfect Match for Bambuser',
            layout: 'two-column',
            columns: [
                {
                    title: 'Requirements',
                    content: [
                        '5+ Years Full-Stack',
                        '3+ Years Frontend/Backend',
                        'GCP Experience',
                        'Real-time Systems',
                        'Security Mindset'
                    ]
                },
                {
                    title: 'My Experience',
                    content: [
                        '7+ Years Professional Exp.',
                        '7+ Years Balanced Stack',
                        'Primary Cloud Platform',
                        'Extensive (CDC, Pub/Sub)',
                        'Security-First Approach'
                    ]
                }
            ]
        },
        // SLIDE 24: WHAT I BRING
        {
            id: 'what-i-bring',
            title: 'What I Bring to Bambuser',
            layout: 'three-column',
            columns: [
                {
                    title: 'Technical Excellence',
                    content: ['7+ Years Mastery', 'GCP Expert', 'TS/React/Node', 'Real-time Systems']
                },
                {
                    title: 'Business Value',
                    content: ['Cost Optimization', 'Scalable Arch', 'Global Experience', 'Data-Driven']
                },
                {
                    title: 'Collaboration',
                    content: ['Cross-functional', 'Communication', 'Code Reviews', 'Mentorship']
                }
            ]
        },
        // SLIDE 25: CLOSING - WHY BAMBUSER
        {
            id: 'closing-why',
            title: 'Why Bambuser?',
            layout: 'grid-cards',
            cards: [
                { icon: Rocket, title: 'Innovation', description: 'Video Commerce Future' },
                { icon: Users, title: 'Team', description: 'World-class Engineers' },
                { icon: Globe, title: 'Impact', description: 'Global Scale' },
                { icon: MapPin, title: 'Stockholm', description: 'Personal Alignment' }
            ]
        },
        // SLIDE 26: WHY STOCKHOLM
        {
            id: 'motivation',
            title: 'Why Stockholm?',
            layout: 'three-column',
            columns: [
                {
                    title: 'Career Motivation',
                    content: [
                        'Specialization in Full Stack & GCP',
                        'Modern web architectures',
                        'Learning from Swedish tech excellence'
                    ]
                },
                {
                    title: 'Cultural Fit',
                    content: [
                        'Appreciate Swedish values (honesty, equality)',
                        'Cost-conscious mindset',
                        'Quality over quantity philosophy'
                    ]
                },
                {
                    title: 'Relocation',
                    content: [
                        'Targeting Stockholm specifically',
                        'Ready to relocate (need Swedish work permit)',
                        'Committed to long-term move'
                    ]
                }
            ]
        },
        // SLIDE 27: LOGISTICS
        {
            id: 'logistics',
            title: 'Logistics & Next Steps',
            layout: 'grid-cards',
            cards: [
                { icon: MapPin, value: 'Lisbon', title: 'Current Location', description: 'Ready to move' },
                { icon: FileCheck, value: 'Visa', title: 'Status', description: 'Need Swedish work permit' },
                { icon: Calendar, value: 'ASAP', title: 'Start Date', description: 'Flexible / Remote start' },
                { icon: Mail, value: 'Contact', title: 'Get in Touch', description: 'Email / LinkedIn' }
            ]
        },
        // SLIDE 28: CLOSING
        {
            id: 'closing',
            title: 'Thank You',
            subtitle: 'Ready to bring full stack excellence to Stockholm',
            layout: 'title-only',
            content: ['Proven Impact'],
            footer: [
                'Wagner Silva | Full Stack Web Developer',
                'wagnersilva.eu | linkedin.com/in/wagnersilva-eu',
                'wagnersilva.eu.cloud@gmail.com'
            ]
        }
    ]
};

