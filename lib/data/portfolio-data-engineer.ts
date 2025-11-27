import type { PresentationData } from '@/lib/types';

export const portfolioData: PresentationData = {
    id: 'portfolio-data-engineer',
    title: 'Data Engineering & Cloud Architecture Portfolio',
    slides: [
        // SLIDE 1: TITLE SLIDE
        {
            id: 'title',
            title: 'Data Engineering & Cloud Architecture Portfolio',
            subtitle: 'GCP Solutions Delivering Measurable Business Impact',
            layout: 'title-only',
            footer: 'Wagner Silva | GCP Architect & Senior Data Engineer'
        },
        // SLIDE 2: EXECUTIVE SUMMARY
        {
            id: 'exec-summary',
            title: 'Portfolio at a Glance',
            layout: 'grid-cards',
            cards: [
                { icon: 'CheckCircle2', value: '10', title: 'Production Projects', description: 'Enterprise-grade solutions' },
                { icon: 'DollarSign', value: '€48K', title: 'Annual Cost Savings', description: 'Infrastructure optimization' },
                { icon: 'Sparkles', value: 'Current', title: 'Tech Skills', description: 'Sharpened & up-to-date' },
                { icon: 'Cloud', value: '7+', title: 'Years Experience', description: 'Cloud-native expertise' }
            ],
            footer: ['These 10 projects are a sample of my work—', 'reliable, scalable solutions built on peer cooperation and cross-team collaboration.']
        },
        // SLIDE 3: TECHNICAL EXPERTISE
        {
            id: 'tech-stack',
            title: 'Technology Stack & Capabilities',
            layout: 'three-column',
            columns: [
                {
                    title: 'Cloud & Infrastructure',
                    content: [
                        'Google Cloud Platform',
                        'Kubernetes (GKE)',
                        'Docker & Containerization',
                        'Terraform (IaC)',
                        'Linux Systems'
                    ]
                },
                {
                    title: 'Data & Databases',
                    content: [
                        'BigQuery, Datastream, Pub/Sub',
                        'Cloud Storage',
                        'AlloyDB, Cloud SQL (PostgreSQL)',
                        'Firestore, Bigtable, Memorystore',
                        'Neo4j (Graph), Qdrant (Vector)'
                    ]
                },
                {
                    title: 'Dev & Integration',
                    content: [
                        'Python',
                        'TypeScript, SQL',
                        'Cloud Run & Jobs, Functions',
                        'APISIX, REST APIs, SFTP',
                        'Vertex AI, Gemini, RAG'
                    ]
                }
            ]
        },
        // SLIDE 4: SECTION DIVIDER
        {
            id: 'section-security',
            title: 'Security & Governance',
            subtitle: 'Protecting Data at Every Layer',
            layout: 'section-header'
        },
        // SLIDE 5: PROJECT 1
        {
            id: 'project-1',
            title: 'Project 1: Custom Row-Level Security',
            subtitle: 'Secure Public Reporting without Login',
            layout: 'project-detail',
            challenge: [
                'Public Looker Studio reports with row-level security but no user login',
                'Need to enforce data access permissions without authentication',
                'Scalability to thousands of anonymous users'
            ],
            solution: [
                'Python reverse proxy intercepts JWT tokens from public URLs',
                'Injects security credentials and user context into requests',
                'Filters BigQuery views based on embedded permissions'
            ],
            impact: [
                'Secure public reporting with zero data exposure',
                'Scalable to thousands of concurrent users',
                'No user authentication required while maintaining security'
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
        // SLIDE 6: PROJECT 2
        {
            id: 'project-2',
            title: 'Project 2: On-Demand Database Anonymization',
            subtitle: 'Safe Development & Testing with Production-Quality Data',
            layout: 'project-detail',
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
        },
        // SLIDE 7: PROJECT 3
        {
            id: 'project-3',
            title: 'Project 3: Real-Time CDC Pipeline',
            subtitle: 'ZNUNY/OTRS Support Analytics',
            layout: 'project-detail',
            challenge: [
                'Real-time analytics required from operational MySQL database',
                'Data minimization requirements for compliance',
                'Cannot impact production database performance'
            ],
            solution: [
                'Datastream CDC for near-zero latency replication',
                'Selective column and table replication to BigQuery',
                'Real-time transformation pipeline for analytics'
            ],
            impact: [
                'Real-time support analytics dashboards in Looker Studio',
                'Reduced operational costs through selective replication',
                'Enhanced security with data minimization'
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
        },
        // SLIDE 8: SECTION DIVIDER
        {
            id: 'section-integration',
            title: 'Data Integration & Pipelines',
            subtitle: 'Scalable & Intelligent Data Flows',
            layout: 'section-header'
        },
        // SLIDE 9: PROJECT 4
        {
            id: 'project-4',
            title: 'Project 4: Reusable SFTP Architecture',
            subtitle: 'Zero Data Loss for Global Clients',
            layout: 'project-detail',
            challenge: [
                'Sync product registration data with zero data loss tolerance',
                'Multiple global clients with similar SFTP requirements',
                'File format validation and error recovery needed'
            ],
            solution: [
                'Reusable Python SFTP client library with comprehensive validation',
                'Atomic file processing with transactional guarantees',
                'Dataflow pipelines for parallel processing and BigQuery loading'
            ],
            impact: [
                'Zero data loss achieved across all client integrations',
                '70% faster implementation time for second client',
                'Reusable architecture deployed to 3 different regions'
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
        },
        // SLIDE 10: PROJECT 5
        {
            id: 'project-5',
            title: 'Project 5: Smart API Integration',
            subtitle: 'Pascom PBX Call Center Data Sync',
            layout: 'project-detail',
            challenge: [
                'Pascom API has no filtering or pagination support',
                'Returns ALL data on every call (5-10K records)',
                'Need near real-time sync without duplicates'
            ],
            solution: [
                'Python sync job on Cloud Run Jobs + Scheduler',
                'Timestamp filtering (past 48h) + hash-based deduplication',
                'Only loads NEW rows to BigQuery (no duplicates)'
            ],
            impact: [
                'Real-time call analytics operational',
                'No duplicate data in BigQuery ever',
                'Handles thousands of calls daily, runs every 15-30 min'
            ],
            techs: ['Python', 'Cloud Run Jobs', 'Cloud Scheduler', 'BigQuery'],
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
        // SLIDE 11: SECTION DIVIDER
        {
            id: 'section-orchestration',
            title: 'Multi-System Orchestration',
            subtitle: 'Synchronizing Global Operations',
            layout: 'section-header'
        },
        // SLIDE 12: PROJECT 6
        {
            id: 'project-6',
            title: 'Project 6: Tri-Directional Sync',
            subtitle: 'Salesforce, Internal DB, TalentLMS',
            layout: 'project-detail',
            challenge: [
                'Keep 3 systems in sync with bidirectional data flow',
                'Different data models and update frequencies across systems',
                'Conflict resolution for concurrent updates'
            ],
            solution: [
                'TypeScript orchestration engine with state management',
                'Conflict detection and resolution with priority rules',
                'Cloud Run Jobs with scheduled and event-driven execution'
            ],
            impact: [
                'Single source of truth across all platforms',
                '20+ hours per week saved from manual data entry',
                '99.9% synchronization success rate'
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
        },
        // SLIDE 13: SECTION DIVIDER
        {
            id: 'section-ai',
            title: 'AI & Innovation',
            subtitle: 'Enterprise AI Platform',
            layout: 'section-header'
        },
        // SLIDE 14: PROJECT 7 - COMBINED RAG + AI AGENTS
        {
            id: 'project-7',
            title: 'Project 7: Enterprise RAG + AI Agents',
            subtitle: 'Organization-Wide AI Platform',
            layout: 'project-detail',
            challenge: [
                'AI search with role-based access and semantic understanding',
                'Need organization-wide AI without individual subscriptions',
                'SSO integration and cost control required'
            ],
            solution: [
                'Multi-database RAG: Qdrant (vectors), Neo4j (graph), PostgreSQL',
                'Multi-level Vertex AI agents with Cloud IAP SSO',
                'Deployed on GKE for scalability'
            ],
            impact: [
                '85% reduction in external AI subscription costs',
                'Semantic search with permission-based filtering',
                'Organization-wide AI access through single platform'
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
        },
        // SLIDE 15: SECTION DIVIDER - ENTERPRISE LEADERSHIP
        {
            id: 'section-leadership',
            title: 'Enterprise Leadership',
            subtitle: 'Cross-Functional Team Coordination',
            layout: 'section-header'
        },
        // SLIDE 16: PROJECT 8
        {
            id: 'project-8-leadership',
            title: 'Project 8: Technical Leadership',
            subtitle: 'SharePoint & Power BI for Global Conservation Foundation',
            layout: 'project-detail',
            challenge: [
                'Complex stakeholder ecosystem (technical & non-technical)',
                'Microsoft 365 integration requirements',
                'Cross-functional team coordination needed'
            ],
            solution: [
                'SharePoint site architecture + Power Automate workflows',
                'Power BI reporting infrastructure for executives',
                'Bridged technical and creative teams effectively'
            ],
            impact: [
                'Data-driven conservation decisions enabled',
                '80% reduction in manual reporting effort',
                'Improved international collaboration'
            ],
            techs: ['SharePoint', 'Power BI', 'Power Automate', 'Microsoft 365'],
            detailSections: [
                {
                    title: 'Technical Delivery',
                    items: [
                        'SharePoint hub with document libraries',
                        'Power Automate data collection workflows',
                        'Power BI executive dashboards',
                        'Data integration from multiple sources'
                    ]
                },
                {
                    title: 'Stakeholder Management',
                    items: [
                        'Foundation executive team',
                        'Field staff across continents',
                        'External designers and copywriters',
                        'IT team coordination'
                    ]
                },
                {
                    title: 'Report Types Delivered',
                    items: [
                        'Executive Dashboard (global metrics)',
                        'Regional Reports (Americas, EMEA, APAC)',
                        'Financial Reports (donor tracking)',
                        'Impact visualization dashboards'
                    ]
                },
                {
                    title: 'Leadership Skills Applied',
                    items: [
                        'Iterative feedback loops',
                        'Clear documentation at all levels',
                        'Consensus building across teams',
                        'Flexible to changing requirements'
                    ]
                }
            ]
        },
        // SLIDE 17: SECTION DIVIDER - INFRASTRUCTURE
        {
            id: 'section-infra',
            title: 'Infrastructure & Cost Optimization',
            subtitle: 'Smart Infrastructure Decisions',
            layout: 'section-header'
        },
        // SLIDE 18: PROJECT 9
        {
            id: 'project-9',
            title: 'Project 9: GCP Cost Optimization',
            subtitle: '€15,000 Annual Savings',
            layout: 'project-detail',
            challenge: [
                'Rising cloud costs threatening project sustainability',
                'No visibility into cost drivers and inefficiencies',
                'Need to optimize without impacting performance or reliability'
            ],
            solution: [
                'Real-time cost monitoring dashboards and automated alerts',
                'Right-sizing analysis for compute, storage, and database resources',
                'Service optimization: Cloud Run vs Functions, Spot VMs, committed use discounts',
                'Code-level optimization: BigQuery query tuning and caching strategies'
            ],
            impact: [
                '€15,000 annual savings (30% cost reduction)',
                'Cost-conscious engineering culture established',
                'Automated cost monitoring prevents future overspend',
                'Optimized BigQuery usage patterns'
            ],
            techs: ['BigQuery', 'Cloud Run', 'Cloud Monitoring', 'Terraform'],
            detailSections: [
                {
                    title: 'Active Monitoring',
                    items: [
                        'Real-time cost tracking dashboards',
                        'Budget alerts and anomaly detection',
                        'Cost allocation by project/team',
                        'Weekly cost review meetings'
                    ]
                },
                {
                    title: 'Right-Sizing',
                    items: [
                        'Cloud SQL: Reduced instance tiers',
                        'GKE: Node pool right-sizing & autoscaling',
                        'Storage: Moved archival to Coldline',
                        'Eliminated over-provisioning'
                    ]
                },
                {
                    title: 'Service Optimization',
                    items: [
                        'Cloud Run vs Functions selection',
                        'Batch jobs → Cloud Run Jobs',
                        'Dev environments: Spot VMs (60% off)',
                        'Committed Use Discounts applied'
                    ]
                },
                {
                    title: 'Code & Queries',
                    items: [
                        'BigQuery partitioning & clustering',
                        'Redis caching layer for APIs',
                        'Optimized data retention policies',
                        'Query optimization: 70% less scanned'
                    ]
                }
            ]
        },
        // SLIDE 19: PROJECT 10
        {
            id: 'project-10',
            title: 'Project 10: APISIX + Crowdsec Gateway',
            subtitle: 'Enterprise Security at Zero Cost',
            layout: 'project-detail',
            challenge: [
                'Cloud Armor cost €36k/year unsustainable for budget',
                'Need enterprise-grade DDoS and threat protection',
                'Require better observability and custom rules'
            ],
            solution: [
                'Open-source APISIX API Gateway deployed on GCE MIG',
                'Crowdsec threat intelligence integration for real-time protection',
                'Prometheus and Grafana for comprehensive monitoring'
            ],
            impact: [
                '€36k annual savings with zero compromise on security',
                'Better observability and custom rule configuration',
                'Enhanced security with community threat intelligence'
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
        },
        // SLIDE 20: COST SAVINGS
        {
            id: 'cost-impact',
            title: 'Total Business Impact',
            subtitle: '€48K+ Annual Savings Delivered',
            layout: 'grid-cards',
            cards: [
                { icon: 'TrendingDown', value: '€15K', title: 'GCP Optimization', description: 'Infrastructure tuning' },
                { icon: 'Shield', value: '€33K', title: 'Cloud Armor Replacement', description: 'APISIX Implementation' },
                { icon: 'Bot', value: '85%', title: 'AI Cost Reduction', description: 'Scalable pay-as-you-go' },
                { icon: 'DollarSign', value: '€48K+', title: 'Total Annual Savings', description: 'Proven cost efficiency' }
            ]
        },
        // SLIDE 21: ACHIEVEMENTS
        {
            id: 'achievements',
            title: 'Core Strengths & Highlights',
            layout: 'grid-cards',
            cards: [
                { icon: 'Puzzle', value: 'Reusable', title: 'Architectures', description: 'Proven at scale' },
                { icon: 'Shield', value: 'Zero', title: 'Data Loss', description: 'Financial data protection' },
                { icon: 'DollarSign', value: '€48K+', title: 'Savings Delivered', description: 'Cost efficiency' },
                { icon: 'Lock', value: 'Security', title: 'First', description: 'Enterprise-grade' },
                { icon: 'Globe', value: 'Global', title: 'Scale', description: 'Multi-continent ops' },
                { icon: 'Rocket', value: 'Innovation', title: 'AI/ML', description: 'RAG & Agents' }
            ]
        },
        // SLIDE 22: PERFECT FIT
        {
            id: 'alignment',
            title: 'Alignment with Role',
            layout: 'two-column',
            columns: [
                {
                    title: 'Requirements',
                    content: [
                        '7+ years Data Engineer experience',
                        'Strong GCP (BigQuery, Cloud Run, etc.)',
                        'SQL proficiency & Python/TypeScript',
                        'Terraform & CI/CD',
                        'NoSQL & RDBMS experience'
                    ]
                },
                {
                    title: 'My Commitment',
                    content: [
                        'With 7+ years delivering production data systems and a proven track record of impact, I bring the experience you need—and the curiosity to master whatever comes next.'
                    ]
                }
            ]
        },
        // SLIDE 23: WHY STOCKHOLM
        {
            id: 'motivation',
            title: 'Why Stockholm?',
            layout: 'three-column',
            columns: [
                {
                    title: 'Career Motivation',
                    content: [
                        'Specialization in GCP Data Engineering',
                        'Modern data architectures',
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
        // SLIDE 24: LOGISTICS
        {
            id: 'logistics',
            title: 'Logistics & Next Steps',
            layout: 'grid-cards',
            cards: [
                { icon: 'MapPin', value: 'Lisbon', title: 'Current Location', description: 'Ready to move' },
                { icon: 'FileCheck', value: 'Visa', title: 'Status', description: 'Need Swedish work permit' },
                { icon: 'Calendar', value: 'ASAP', title: 'Start Date', description: 'Flexible / Remote start' },
                { icon: 'Mail', value: 'Contact', title: 'Get in Touch', description: 'Email / LinkedIn' }
            ]
        },
        // SLIDE 25: CLOSING
        {
            id: 'closing',
            title: 'Thank You',
            subtitle: 'Ready to bring data engineering excellence to Stockholm',
            layout: 'title-only',
            content: ['Proven Impact'],
            footer: 'Wagner Silva | GCP Architect & Senior Data Engineer'
        }
    ]
};
