Create a professional PowerPoint presentation for a Data Engineer portfolio targeting a GCP Data Engineer position at a Swedish tech company in Stockholm. This presentation will be approximately 30 slides total.

=== DESIGN SPECIFICATIONS ===

TARGET AUDIENCE: Swedish hiring managers and technical leads for GCP Data Engineer role
DESIGN STYLE: Modern, clean, Scandinavian minimalist aesthetic
COLOR PALETTE:
- Primary Blue: #1A73E8 (Google Cloud blue)
- Success Green: #34A853 (for metrics, savings)
- Innovation Orange: #FBBC04 (for highlights)
- Neutral Gray: For body text
- Clean White: Backgrounds

TYPOGRAPHY:
- Headers: Bold sans-serif (Roboto/Montserrat), 36-44pt
- Body: Clean sans-serif, 18-20pt minimum
- Metrics: Extra bold, 60-72pt
- Diagrams: 14-16pt labels

DESIGN PRINCIPLES:
- Scandinavian minimalism: generous white space, clean lines
- High contrast for readability
- Simple, clear architecture diagrams with official GCP service icons
- Consistent visual hierarchy
- Professional but warm and approachable

=== SLIDE CONTENT ===

---
SLIDE 1: TITLE SLIDE
---
Design: Clean with subtle blue-to-white gradient background

Content:
Main Title: "Data Engineering & Cloud Architecture Portfolio"
Subtitle: "GCP Solutions Delivering Measurable Business Impact"
Name: [Your Name]
Role: "GCP Architect & Senior Data Engineer"
Experience: "6+ Years | Lagoasoft | MMW"
Location: "Lisbon, Portugal → Stockholm, Sweden"

Visual Elements:
- Subtle Google Cloud Platform logo watermark in background
- Professional, clean layout
- Contact info at bottom (small, discreet)

---
SLIDE 2: EXECUTIVE SUMMARY
---
Title: "Portfolio at a Glance"

Layout: 4 large metric cards in grid (2x2)

CARD 1:
Icon: Checkmark in circle
Number: "10"
Label: "Production Projects"
Subtext: "Enterprise-grade solutions"

CARD 2:
Icon: Money/savings symbol
Number: "€48K"
Label: "Annual Cost Savings"
Subtext: "Infrastructure optimization"

CARD 3:
Icon: Globe/world
Number: "3"
Label: "Continents"
Subtext: "Americas, EMEA, APAC"

CARD 4:
Icon: Users/organization
Number: "6+"
Label: "Years GCP Experience"
Subtext: "Cloud-native expertise"

Bottom Strip (3 badges):
[Shield icon] Zero Data Loss | [Lock icon] Security-First | [Star icon] Proven at Scale

Design Notes: Keep it high-level and impactful. Large numbers, minimal text.

---
SLIDE 3: TECHNICAL EXPERTISE
---
Title: "Technology Stack & Capabilities"

Layout: Organized by capability category (not by GCP vs non-GCP)

CATEGORY 1: CLOUD PLATFORM & INFRASTRUCTURE (left column)
- Google Cloud Platform (6+ years) ⭐
- Kubernetes (GKE) ⭐
- Docker & Containerization
- Terraform (Infrastructure as Code)
- Linux Systems

CATEGORY 2: DATA ENGINEERING & DATABASES (center column)
Data Services:
- BigQuery ⭐
- Datastream ⭐
- Cloud Storage
- Pub/Sub ⭐

Databases:
- AlloyDB, Cloud SQL (PostgreSQL, MySQL)
- Firestore, Bigtable (NoSQL)
- Memorystore (Redis)
- Neo4j (Graph), Qdrant (Vector)

CATEGORY 3: DEVELOPMENT & INTEGRATION (right column)
Programming:
- Python ⭐ (7 years)
- TypeScript
- SQL ⭐ (6 years)

Compute & Orchestration:
- Cloud Run & Cloud Run Jobs ⭐
- Cloud Functions ⭐
- Cloud Scheduler
- APISIX (API Gateway)

Integration:
- REST APIs, SFTP
- Salesforce/Pardot
- Third-party SaaS platforms

CATEGORY 4: AI/ML & ANALYTICS (bottom section)
- Vertex AI, Gemini Models
- RAG Systems, Vector Embeddings
- Looker Studio, Power BI
- Data Visualization

CATEGORY 5: SECURITY & IDENTITY (footer)
- Cloud IAP (Identity-Aware Proxy)
- Crowdsec, JWT
- SSO Integration

Visual Design: Use official logos/icons for each technology. Group visually by category with subtle background colors or borders to differentiate sections.

Note: ⭐ indicates technologies explicitly mentioned in target job description

---
SLIDE 4: SECTION DIVIDER
---
Full screen design with centered content

Large Icon: Shield with lock symbol
Main Text: "Security & Governance"
Subtitle: "Protecting Data at Every Layer"
Projects: "Projects 1-3"

Background: Subtle blue gradient from top to bottom
Design: Minimalist, impactful transition slide

---
SLIDE 5: PROJECT 1 - LOOKER STUDIO ROW-LEVEL SECURITY
---
Title: "Custom Row-Level Security for Public Reporting"
Client: "Major European Coffee Machine Brand"

LEFT SIDE (40% width):

THE CHALLENGE:
- Looker Studio reports must be publicly accessible
- No Google account login required
- Zero data exposure for unauthenticated users
- Row-level security based on embedding system user context

THE SOLUTION:
- Built custom Python reverse proxy server
- Intercepts JWT tokens from embedding application
- Automatically injects authentication secrets
- BigQuery view enforces row-level filtering
- Only shows data matching user's secrets

THE IMPACT:
✓ Secure public reporting without data exposure
✓ Enterprise-grade security on open internet links
✓ Seamless user experience (no login friction)
✓ Scalable to thousands of concurrent users

RIGHT SIDE (60% width):

ARCHITECTURE DIAGRAM:
[Create visual flow diagram with these elements and GCP service icons]

1. User Browser
   ↓ (embeds report with JWT)
2. Embedding System (generates JWT with user context)
   ↓
3. Python Reverse Proxy (Cloud Run)
   [Cloud Run icon]
   - Intercepts request
   - Validates JWT
   - Injects secrets
   ↓
4. Looker Studio Report
   [Looker Studio icon]
   ↓
5. BigQuery
   [BigQuery icon]
   View with row-level security:
   WHERE secret = injected_secret
   ↓
6. Filtered Data (only authorized rows)
   ↓ (returns to)
7. User Browser (sees only their data)

Diagram Style: Clean boxes with arrows, use official GCP icons for Cloud Run, Looker Studio, and BigQuery. Show data flow clearly with labeled arrows.

FOOTER:
Tech Stack Icons: [Python icon] [Cloud Run icon] [Looker Studio icon] [BigQuery icon] [JWT symbol]

---
SLIDE 6: PROJECT 2 - ON-DEMAND DATABASE ANONYMIZATION
---
Title: "On-Demand Database Snapshots with Anonymization"
Context: "Safe Development & Testing with Production-Quality Data"

LEFT SIDE (40% width):

THE CHALLENGE:
- Developers and testers need realistic data
- Cannot expose production PII/sensitive data
- Data must be fresh and representative
- Need ability to refresh environments on-demand
- Maintain data quality for accurate testing

THE SOLUTION:
- Built on-demand snapshot and anonymization tool
- Triggered manually when fresh data needed
- Python-based anonymization algorithms
- PII masking and data generalization
- Maintains referential integrity
- Creates completely new database instances

THE IMPACT:
✓ High-quality testing with realistic data
✓ Full data security compliance
✓ Developers can refresh data whenever needed
✓ No risk of production data exposure
✓ Fast environment provisioning (< 2 hours)

RIGHT SIDE (60% width):

ARCHITECTURE DIAGRAM:
[Create on-demand snapshot process with GCP service icons]

TRIGGER (Manual or API):
Developer Request: "Need fresh staging database"
   ↓
[Cloud Run Jobs icon] Snapshot & Anonymization Job (Cloud Run Jobs)
Triggered on-demand (not scheduled)
   ↓
STEP 1: CREATE SNAPSHOT
[Cloud SQL icon] Production Cloud SQL
Action: Create point-in-time snapshot
No impact on production performance
   ↓
[Cloud Storage icon] Temporary Snapshot Storage
Snapshot exported to Cloud Storage
Format: SQL dump or Cloud SQL backup
   ↓
STEP 2: ANONYMIZATION PROCESSING
[Cloud Run Jobs icon] Python Anonymization Engine
Processing Logic:
- Parse SQL dump
- Identify PII fields (emails, names, phones, addresses)
- Apply anonymization rules:
  • Email: user_12345@test.com
  • Name: FirstName_12345
  • Phone: 555-XXXX
  • Address: Generic addresses
- Maintain referential integrity (foreign keys)
- Preserve data distributions
- Keep test-friendly values
   ↓
STEP 3: CREATE NEW DATABASE
[Cloud SQL icon] Target Environment
- Staging Cloud SQL (separate instance)
  OR
- Development Cloud SQL (separate instance)

Action: 
1. Drop existing data (if any)
2. Import anonymized snapshot
3. Rebuild indexes
4. Update connection strings
   ↓
RESULT: Fresh, Anonymized Database Ready

ANONYMIZATION EXAMPLES (callout box):
BEFORE (Production):
- john.doe@company.com
- +1-555-1234
- 123 Real Street, City

AFTER (Staging/Dev):
- user_89234@test.com
- +1-555-0000
- 123 Test Street, TestCity

EXECUTION TIME: 
Small DB (< 10GB): ~30 minutes
Medium DB (10-100GB): ~1-2 hours
Large DB (> 100GB): ~2-4 hours

ON-DEMAND TRIGGERS (side callout):
✓ Manual: Developer runs command
✓ API: Automated via internal tool
✓ Before major releases
✓ When data becomes stale
✓ For new developer onboarding

Diagram Style: Show the one-time flow from production snapshot → anonymization → new database. Use clear arrows indicating this is an on-demand process, not continuous. Add a "trigger" icon at the top to emphasize manual initiation.

FOOTER:
Tech Stack Icons: [Python icon] [Cloud SQL icon] [Cloud Run Jobs icon] [Cloud Storage icon]
---
SLIDE 7: PROJECT 3 - ZNUNY/OTRS CDC PIPELINE
---
Title: "Real-Time Customer Support Analytics via CDC"
Context: "ZNUNY/OTRS Ticketing System to BigQuery"

LEFT SIDE (40% width):

THE CHALLENGE:
- Need real-time analytics on support tickets
- Two separate MySQL databases (ZNUNY/OTRS)
- Only replicate necessary data (data minimization)
- Enhanced security for customer PII
- Maintain data freshness for reporting

THE SOLUTION:
- Implemented Datastream CDC pipelines
- Selective table and column replication
- Continuous data replication (sub-second latency)
- Automatic schema evolution handling
- Security controls on sensitive fields

THE IMPACT:
✓ Real-time support metrics and dashboards
✓ Improved data governance and security
✓ Reduced data transfer costs (selective replication)
✓ Support teams have instant visibility

RIGHT SIDE (60% width):

ARCHITECTURE DIAGRAM:
[Create CDC pipeline diagram with GCP icons]

SOURCE SYSTEMS:
[MySQL icon] ZNUNY MySQL Database
[MySQL icon] OTRS MySQL Database
   ↓
[Datastream icon] Datastream CDC
Configuration:
- Selected Tables Only:
  • tickets (all columns)
  • customers (name, email only - NOT full address)
  • agents (name, email only - NOT salary data)
  • ticket_history (filtered columns)
- Continuous Replication
- Change Data Capture (INSERT, UPDATE, DELETE)
   ↓
[BigQuery icon] Target: BigQuery Dataset
Automatically creates/updates tables:
- tickets (real-time)
- customers (PII protected)
- agents (sensitive data excluded)
- ticket_history (real-time)
   ↓
[Looker Studio icon] Real-time Dashboards
- Ticket volume
- Response times
- Agent performance
- Customer satisfaction

Callout Box: "Data Minimization: Only 40% of source columns replicated"

Diagram Style: Show two MySQL sources converging into Datastream, then flowing to BigQuery, ending in dashboards. Use official icons and show filtering/selection happening at Datastream level.

FOOTER:
Tech Stack Icons: [MySQL icon] [Datastream icon] [BigQuery icon] [CDC symbol] [Looker Studio icon]

---
SLIDE 8: SECTION DIVIDER
---
Full screen design with centered content

Large Icon: Pipeline/connected nodes symbol
Main Text: "Data Integration & Pipelines"
Subtitle: "Scalable & Intelligent Data Flows"
Projects: "Projects 4-5"

Background: Subtle green gradient
Design: Clean transition slide

---
SLIDE 9: PROJECT 4 - REUSABLE SFTP ARCHITECTURE
---
Title: "Reusable SFTP Pipeline: Proven Across Global Clients"
Clients: "German Electronics Company | South Korean Electronics Brand"

TOP SECTION (20% height):

THE CHALLENGE:
- Product registration sync for post-sale campaigns
- ZERO data loss tolerance (payment data)
- High-accuracy requirements for financial records
- Multiple clients with similar needs
- Cross-infrastructure connectivity coordination

THE SOLUTION:
- Built reusable Python SFTP client
- Scheduled execution via Cloud Run Jobs + Scheduler
- Comprehensive validation and error handling
- Designed for multi-client deployment from day one
- 70% faster second client implementation

CENTER SECTION (60% height):

ARCHITECTURE DIAGRAM:
[Create reusable architecture with two client paths]

CLIENT 1 PATH:
[Server icon] German Electronics SFTP Server
   ↓
CLIENT 2 PATH:
[Server icon] South Korean Electronics SFTP Server
   ↓↓ (both connect to same pipeline)
   
SHARED PIPELINE:
[Cloud Scheduler icon] Cloud Scheduler
Triggers: Daily at 02:00 UTC
   ↓
[Cloud Run Jobs icon] Python SFTP Client (Cloud Run Jobs)
Python Application:
- Connects to SFTP server
- Downloads new files
- Validates file integrity (checksums)
- Zero data loss verification
- Error handling & retry logic
   ↓
[Cloud Storage icon] Cloud Storage (Staging)
Bucket structure:
/client-1/raw/YYYY-MM-DD/
/client-2/raw/YYYY-MM-DD/
Validation:
✓ File completeness
✓ Row count verification
✓ Data format checks
   ↓
[Dataflow icon] Dataflow Processing
- Data transformation
- Deduplication
- Enrichment
   ↓
[BigQuery icon] BigQuery
- client_1_products table
- client_2_products table
Final Validation:
✓ Row count matches source
✓ Payment data accuracy check
✓ No duplicate records

REUSABILITY CALLOUT BOX (highlight):
"Same Codebase, Multiple Clients"
✓ Configuration-driven deployment
✓ 70% time savings on Client 2
✓ Proven architecture reliability

BOTTOM SECTION (20% height):

THE IMPACT:
✓ ZERO data loss on financial transactions
✓ Reusable architecture across 2 major brands
✓ Reduced development time dramatically
✓ Scalable to additional clients

FOOTER:
Tech Stack Icons: [Python icon] [SFTP icon] [Cloud Run Jobs icon] [Cloud Scheduler icon] [Cloud Storage icon] [Dataflow icon] [BigQuery icon]

---
SLIDE 10: PROJECT 5 - INTELLIGENT API INTEGRATION
---
Title: "Smart API Integration: Overcoming Severe Constraints"
Context: "Pascom PBX Call Center Data Sync"

LEFT SIDE (40% width):

THE CHALLENGE:
- Pascom PBX API extremely limited:
  ❌ No filtering capabilities
  ❌ No pagination support
  ❌ Returns ALL data on every call
- Need to sync call data to BigQuery
- Avoid loading duplicate records
- Must run frequently for near real-time data

THE SOLUTION:
- Python sync job on Cloud Run Jobs + Scheduler
- Custom timestamp-based filtering (past 48 hours)
- Hash-based deduplication for efficiency
- Only loads NEW rows to BigQuery
- Can run anytime without data duplication risk

THE IMPACT:
✓ Real-time call analytics operational
✓ No duplicate data in BigQuery
✓ Efficient processing despite API limitations
✓ Handles thousands of calls per day
✓ Scalable and reliable solution

RIGHT SIDE (60% width):

ARCHITECTURE DIAGRAM:
[Create processing flow with GCP icons]

[Cloud Scheduler icon] Cloud Scheduler
Trigger: Every 15-30 minutes
   ↓
[Cloud Run Jobs icon] Python Sync Job (Cloud Run Jobs)
   ↓
STEP 1: FETCH DATA
[Pascom API icon] Pascom PBX API
Returns: ALL call records (no filtering available)
Typical response: 5,000-10,000 call records
   ↓
[Cloud Run Jobs icon] STEP 2: TIMESTAMP FILTERING
Python Logic:
- Filter records from past 48 hours only
- Discard older records locally
- Example: Keep calls from last 48h → ~500 records
   ↓
STEP 3: GENERATE HASHES
For each record, generate unique hash:
hash = md5(call_id + timestamp + phone_number + duration + agent_id)

Example:
Call: ID=12345, Time=2025-01-15 10:30, Phone=555-1234, Duration=180s
Hash: a3f5e89b2c1d...
   ↓
STEP 4: CHECK FOR DUPLICATES
[BigQuery icon] Query BigQuery
SELECT hash FROM calls_table WHERE hash IN (list_of_hashes)
Returns: Hashes that already exist
   ↓
STEP 5: FILTER NEW RECORDS
Compare generated hashes vs existing hashes
Keep only records with NEW hashes
Example: 500 records → 50 new records
   ↓
STEP 6: LOAD TO BIGQUERY
[BigQuery icon] Insert New Records Only
Load only the 50 new records
No duplicates possible

EFFICIENCY CALLOUT BOX:
API Returns: 10,000 records
After 48h filter: 500 records  
After deduplication: 50 records
Loaded to BigQuery: 50 records

Reduction: 99.5% fewer inserts!

HASH DEDUPLICATION BENEFITS:
✓ Fast comparison (hash vs full record)
✓ Deterministic (same data = same hash)
✓ Memory efficient
✓ No external cache needed
✓ Works even if job runs multiple times

Diagram Style: Show linear flow with clear filtering stages. Emphasize the reduction in data volume at each step. No external cache/storage - just the Python job doing smart filtering.

FOOTER:
Tech Stack Icons: [Python icon] [REST API icon] [Cloud Run Jobs icon] [Cloud Scheduler icon] [BigQuery icon]

---
SLIDE 11: SECTION DIVIDER
---
Full screen design with centered content

Large Icon: Interconnected gears/systems
Main Text: "Multi-System Orchestration"
Subtitle: "Synchronizing Global Operations"
Projects: "Project 6"

Background: Orange gradient
Design: Bold transition slide

---
SLIDE 12: PROJECT 6 - TRI-DIRECTIONAL SYNC
---
Title: "Complex Orchestration: 3 Systems, Bidirectional Sync"
Client: "Worldwide Solar Panel Company (Americas | EMEA | APAC)"

TOP SECTION (25% height):

THE CHALLENGE:
- Keep 3 separate systems in perfect sync
- Bidirectional data flow between ALL systems
- Conflict resolution for simultaneous updates
- Different APIs, rate limits, data models
- Global operations across multiple time zones
- Critical for sales, marketing, and training coordination

THE SOLUTION:
- TypeScript orchestration engine
- Last-updated timestamp conflict resolution
- Intelligent retry mechanisms
- API rate limit management
- Comprehensive error handling and monitoring

CENTER SECTION (50% height):

ARCHITECTURE DIAGRAM:
[Create triangle orchestration diagram with bidirectional arrows]

               [Salesforce/Pardot icon]
                Pardot/Salesforce
             Marketing & CRM Data:
             - Leads
             - Campaigns
             - Email engagement
                       ↕
                       ↕ (bidirectional sync)
                       ↕
    [Database icon]   ↕   [TalentLMS icon]
    Internal Systems  ↔   TalentLMS
    Company Data:         Training Data:
    - Employee records    - Course completions
    - Product catalog     - Certifications
    - Custom fields       - Learning paths
           ↕                     ↕
           ↕←←←←← sync →→→→→→→↕

CENTER OF TRIANGLE:
[Cloud Run Jobs icon] TypeScript Orchestration Engine
Runs: Every 5 minutes (Cloud Scheduler)

ORCHESTRATION LOGIC BOX:
1. Fetch last_updated from all 3 systems
2. Identify changes since last sync
3. Resolve conflicts:
   IF conflict THEN use most recent timestamp
4. Transform data for target system format
5. Push updates to each system
6. Log sync status and metrics
7. Alert on failures

SYNC FLOW EXAMPLES (show 3 mini-flows):

Example 1: Lead Nurture
Pardot (new lead) → Internal System (enrichment) → TalentLMS (auto-enroll)

Example 2: Training Completion
TalentLMS (certification) → Internal System (update status) → Pardot (campaign trigger)

Example 3: Product Update
Internal System (new product) → Pardot (marketing material) → TalentLMS (training content)

BOTTOM SECTION (25% height):

THE IMPACT:
✓ Single source of truth across systems
✓ Eliminated 20+ hours/week manual data entry
✓ Real-time visibility for global teams
✓ Supports operations across 3 continents
✓ 99.9% sync success rate

METRICS CALLOUT:
- 15,000+ records synced daily
- 99.9% uptime
- <5 minute sync latency
- Zero data loss

FOOTER:
Tech Stack Icons: [TypeScript icon] [Cloud Run Jobs icon] [Cloud Scheduler icon] [Salesforce icon] [Pardot icon] [TalentLMS icon] [REST API icon]

---
SLIDE 13: SECTION DIVIDER
---
Full screen design with centered content

Large Icon: Brain with circuit patterns
Main Text: "AI & Innovation"
Subtitle: "Enterprise AI Platform"
Projects: "Project 7"

Background: Purple gradient
Design: Futuristic, innovative feel

---
SLIDE 14: PROJECT 7 PART 1 - RAG SYSTEM ARCHITECTURE
---
Title: "Enterprise RAG System: Intelligent Knowledge Base"
Subtitle: "Part 1: Document Processing & Retrieval Infrastructure"

LEFT SIDE (35% width):

THE CHALLENGE:
- Organization needs AI-powered document search
- Must respect role-based access controls
- Need semantic understanding (not just keywords)
- Document relationships and context matter
- High-performance requirements (100+ concurrent users)

THE SOLUTION:
- Built custom RAG (Retrieval-Augmented Generation) system
- Multi-database architecture for different data types
- Microservices on Kubernetes for scalability
- Vector embeddings for semantic search
- Knowledge graph for document relationships

KEY FEATURES:
- Semantic similarity search
- Context-aware retrieval
- Permission-based filtering
- Multi-language support
- Real-time indexing

RIGHT SIDE (65% width):

ARCHITECTURE DIAGRAM:
[Create comprehensive data flow diagram with GCP icons]

DOCUMENT INGESTION PIPELINE:

[Cloud Storage icon] Cloud Storage
Documents: PDF, DOCX, TXT, Markdown
   ↓
[GCE icon] Processing Workers (GCE Instances)
Python/TypeScript Ingestion Pipeline:
- PDF text extraction
- Document chunking (512 tokens)
- Metadata extraction
- Language detection
   ↓
THREE-DATABASE STORAGE ARCHITECTURE:

PATH 1: Vector Storage
[Processing] → Generate Embeddings
   ↓
[Qdrant icon] Qdrant Vector Database
Stores: Document embeddings (768 dimensions)
Purpose: Semantic similarity search
Index: HNSW for fast retrieval

PATH 2: Graph Storage
[Processing] → Extract Relationships
   ↓
[Neo4j icon] Neo4j Graph Database
Stores: Document connections
Relationships:
- REFERENCES
- SIMILAR_TO
- AUTHORED_BY
- BELONGS_TO_PROJECT
Purpose: Context and relationship queries

PATH 3: Structured Metadata
[Processing] → Extract Metadata
   ↓
[AlloyDB icon] AlloyDB (PostgreSQL)
Stores: 
- User permissions
- Document metadata
- Access control lists
- Audit logs
Purpose: Security and structured queries

QUERY FLOW:

User Query: "Show me Q3 planning documents I have access to"
   ↓
[GKE icon] Query Service (GKE)
   ↓
STEP 1: Check Permissions (AlloyDB)
Get user's allowed document IDs
   ↓
STEP 2: Vector Search (Qdrant)
Find semantically similar documents
   ↓
STEP 3: Graph Expansion (Neo4j)
Find related documents via relationships
   ↓
STEP 4: Filter & Rank
Combine results, apply permissions, rank by relevance
   ↓
[Memorystore icon] Memorystore (Redis)
Cache: Frequent queries (TTL: 5 minutes)
   ↓
Return: Top 10 relevant, permitted documents

INFRASTRUCTURE LAYER:
[GKE icon] Google Kubernetes Engine
- Microservices architecture
- Auto-scaling (2-20 pods)
- Load balancing
- Health checks

FOOTER:
Tech Stack Icons: [Python icon] [TypeScript icon] [GCE icon] [GKE icon] [Cloud Storage icon] [Qdrant icon] [Neo4j icon] [AlloyDB icon] [Memorystore icon]

---
SLIDE 15: PROJECT 7 PART 2 - AI AGENTS & SSO
---
Title: "Multi-Level AI Agents: Organization-Wide Intelligence"
Subtitle: "Part 2: Intelligent Agents with Enterprise Security"

TOP SECTION (30% height):

THE CHALLENGE:
- Individual AI Pro subscriptions too expensive at scale
- Data security risks with personal AI accounts
- Need role-based AI capabilities
- Must integrate with company knowledge base (RAG)
- Seamless authentication required

THE SOLUTION:
- Built multi-level AI agent system on Vertex AI
- Integrated with RAG for company-specific knowledge
- Google Cloud IAP for SSO (zero additional logins)
- Role-based agent permissions
- Centralized platform replacing individual subscriptions

CENTER SECTION (40% height):

ARCHITECTURE DIAGRAM:
[Create AI agent flow with GCP icons and security layers]

USER ACCESS LAYER:
[User icon] User (Google Workspace)
Already authenticated in company systems
   ↓
[Cloud IAP icon] Google Cloud Identity-Aware Proxy
- Seamless SSO
- No additional login
- User identity propagated
- Group membership available
   ↓
[GKE icon] AI Agent Gateway (GKE)
Route to appropriate agent based on user role

AGENT TIERS (show 3 parallel paths):

TIER 1: Basic Agent
[Gemini icon] Gemini 1.5 Flash
Users: All employees
Capabilities:
- General Q&A
- Document summarization
- No sensitive data access
- Public knowledge only

TIER 2: Professional Agent
[Gemini icon] Gemini 1.5 Pro
Users: Managers, analysts
Capabilities:
- RAG integration (dept documents)
- Advanced analysis
- Department-specific knowledge
- Limited sensitive data

TIER 3: Executive Agent
[Gemini icon] Gemini 2.0 Flash
Users: Executives, senior leadership
Capabilities:
- Full RAG access
- All company documents
- Strategic analysis
- Financial data access

AGENT PROCESSING FLOW:
User Query → Agent receives query + user context
   ↓
[AlloyDB icon] Check Permissions (AlloyDB)
What documents can this user access?
   ↓
[Qdrant + Neo4j icons] RAG System Query
Retrieve relevant, permitted documents
   ↓
[Vertex AI icon] Vertex AI Gemini
Context: Retrieved documents + user query
Generate: Informed response
   ↓
[Memorystore icon] Cache Response (Memorystore)
For similar future queries
   ↓
Return to User (via IAP)

SECURITY CALLOUT BOX:
✓ All data stays in company infrastructure
✓ Role-based access control
✓ Audit logging of all queries
✓ No data sent to external AI providers
✓ Seamless Google Workspace SSO

BOTTOM SECTION (30% height):

THE IMPACT (Large, Bold Metrics):

85% COST REDUCTION
Eliminated individual AI Pro subscriptions
Annual Savings: ~€50K

100% DATA SECURITY
Zero data leakage to external providers
All processing in company GCP

ORGANIZATION-WIDE ADOPTION
500+ active users
10K+ queries per day

ZERO LOGIN FRICTION
Seamless Google Workspace SSO
No password fatigue

FOOTER:
Tech Stack Icons: [Python icon] [TypeScript icon] [Vertex AI icon] [Gemini icon] [Cloud IAP icon] [GKE icon] [AlloyDB icon] [Qdrant icon] [Neo4j icon] [Memorystore icon]

---
SLIDE 16: SECTION DIVIDER
---
Full screen design with centered content

Large Icon: Server/Gateway infrastructure
Main Text: "Infrastructure & Cost Optimization"
Subtitle: "Smart Infrastructure Decisions"
Projects: "Projects 8-10"

Background: Blue gradient
Design: Technical, infrastructure-focused feel

---
SLIDE 17: PROJECT 10 - APISIX + CROWDSEC GATEWAY
---
Title: "Open-Source API Gateway: Enterprise Security at Zero Cost"
Context: "Replacing Cloud Armor with APISIX + Crowdsec"

TOP SECTION (20% height):

THE PROBLEM:
[Large red text] Cloud Armor Cost: $3,000/month ($36,000/year)
- DDoS protection needed
- WAF capabilities required
- Budget unsustainable
- Need better API observability

THE SOLUTION:
[Large green text] New Solution Cost: $0/month
- APISIX open-source API gateway
- Crowdsec community threat intelligence
- Enhanced SRE capabilities
- Better control and flexibility

CENTER SECTION (55% height):

ARCHITECTURE DIAGRAM:
[Create before/after comparison + new architecture]

BEFORE (OLD ARCHITECTURE):
Internet Traffic → [Cloud Armor icon] Cloud Armor ($3K/month)
   ↓
[Load Balancer icon] Cloud Load Balancer
   ↓
[GKE icon] GKE Backend Services

AFTER (NEW ARCHITECTURE):

Internet Traffic
   ↓
[Load Balancer icon] Cloud Load Balancer
   ↓
[APISIX icon] APISIX API Gateway (GKE)
Deployed as Kubernetes service
Pods: 3 replicas for HA
   ↑
   Integrates with
   ↓
[Crowdsec icon] Crowdsec Security Engine
Threat Detection Components:
- Behavioral analysis
- Community threat intelligence
- Real-time IP reputation
- Automatic banning

APISIX FEATURES (show in gateway box):
- Rate Limiting (per client)
- Custom Authentication
- Traffic Routing
- Circuit Breaker
- Health Checks
- Request/Response Transformation

SECURITY FEATURES (callout):
Protection Against:
✓ DDoS attacks
✓ Brute force attempts
✓ SQL injection
✓ XSS attacks
✓ Bot traffic
✓ Known malicious IPs

   ↓
Request Processing Flow:
1. Crowdsec checks IP reputation
2. APISIX validates authentication
3. APISIX checks rate limits
4. APISIX routes to backend
   ↓
[GKE icon] Backend Services (GKE)
Multiple microservices
   ↓
OBSERVABILITY STACK:
[Prometheus icon] Prometheus (Metrics)
[Grafana icon] Grafana (Dashboards)
[Cloud Monitoring icon] Cloud Monitoring (Alerts)

Metrics Tracked:
- Request rate (per endpoint)
- Latency (p50, p95, p99)
- Error rates
- Attack blocks
- Threat detections

MIGRATION STRATEGY (side box):
✓ Blue-green deployment
✓ Gradual traffic shift (10% → 50% → 100%)
✓ Parallel running during validation
✓ Rollback plan ready
✓ Zero downtime achieved

BOTTOM SECTION (25% height):

THE IMPACT (Large Metrics):

$36,000 ANNUAL SAVINGS
100% Cloud Armor cost eliminated

ENHANCED SECURITY
Community threat intelligence
99.9% attack detection rate

BETTER OBSERVABILITY
10x improvement in API visibility
Custom metrics per endpoint

IMPROVED PERFORMANCE
Sub-millisecond added latency
Faster than Cloud Armor

GREATER CONTROL
Custom plugins and policies
No vendor lock-in

FOOTER:
Tech Stack Icons: [APISIX icon] [Crowdsec icon] [GKE icon] [Kubernetes icon] [Prometheus icon] [Grafana icon] [Lua icon]

---
SLIDE 18: PROJECT 9 - GCP COST OPTIMIZATION
---
Title: "Continuous GCP Cost Optimization Program"
Context: "Strategic Infrastructure Cost Management"

TOP CENTER (20% height):

ACHIEVEMENT:
[Huge, bold text] €15,000
Annual Savings Achieved
30% Year-over-Year Cost Reduction

CENTER SECTION (60% height):

OPTIMIZATION APPROACH (4 quadrants in grid):

QUADRANT 1: ACTIVE MONITORING
[Cloud Monitoring icon]
- Real-time cost tracking dashboards
- Resource utilization metrics
- Budget alerts and anomaly detection
- Cost allocation by project/team
- Weekly cost review meetings

Tools Used:
- Cloud Monitoring
- Cloud Logging
- BigQuery for cost analysis
- Custom Grafana dashboards

Example Savings:
Identified idle Cloud SQL instance running 24/7
Action: Scheduled shutdown during off-hours
Savings: €2,400/year

QUADRANT 2: RIGHT-SIZING
[Resize icon]
- Compute instance analysis
- Storage tier optimization
- Database sizing review
- Memory/CPU utilization tracking
- Eliminate over-provisioning

Actions Taken:
- Cloud SQL: Reduced from db-n1-standard-4 to db-n1-standard-2
- GKE nodes: Switched to e2 machine types
- Cloud Storage: Moved archival data to Coldline

Example Savings:
Over-provisioned GKE cluster (50% avg CPU)
Action: Reduced node pool size, enabled autoscaling
Savings: €4,200/year

QUADRANT 3: SERVICE OPTIMIZATION
[Tools icon]
- Choose correct GCP service for workload
- Cloud Run vs Cloud Functions vs GKE
- Committed Use Discounts
- Sustained Use Discounts
- Spot VMs for batch workloads

Decision Examples:
- Replaced always-on Cloud Functions → Cloud Run (pay per request)
- Batch jobs: GKE → Cloud Run Jobs (ephemeral)
- Dev environments: Spot VMs (60% discount)

Example Savings:
Migrated scheduled jobs from GKE to Cloud Run Jobs
Action: Pay only for job execution time
Savings: €3,800/year

QUADRANT 4: CODE & PRODUCT
[Code icon]
- Application code refactoring
- Cloud-native patterns
- Efficient query optimization
- Caching strategies
- Product decisions impacting infrastructure

Improvements Made:
- BigQuery queries: Partitioning/clustering
- API responses: Redis caching layer
- Image processing: Batch vs real-time decision
- Data retention: 7 years → 2 years for some datasets

Example Savings:
BigQuery query optimization (clustering + partitioning)
Action: Reduced data scanned by 70%
Savings: €4,600/year

BOTTOM SECTION (20% height):

COST BREAKDOWN (visual chart):
[Show before/after monthly costs]

Before Optimization: €50K/year
- Compute: €22K
- Storage: €12K
- Networking: €8K
- BigQuery: €8K

After Optimization: €35K/year (€15K saved)
- Compute: €14K (↓€8K)
- Storage: €9K (↓€3K)
- Networking: €6K (↓€2K)
- BigQuery: €6K (↓€2K)

CULTURE IMPACT:
✓ Cost-conscious engineering culture
✓ Engineers consider cost in design decisions
✓ Regular cost review as part of sprint planning
✓ Cost optimization is ongoing, not one-time

FOOTER:
Tech Stack Icons: [Cloud Monitoring icon] [Cloud Logging icon] [BigQuery icon] [Resource Manager icon] [Cost Management icon]

---
SLIDE 19: PROJECT 8 - ENTERPRISE LEADERSHIP
---
Title: "Technical Leadership: SharePoint & Power BI Implementation"
Client: "Global Conservation & Climate Change Foundation"

LEFT SIDE (45% width):

CONTEXT:
Client: Major worldwide foundation (global operations)
Scale: Multi-country conservation initiatives
Role: Technical Lead
Duration: 3-month project

THE CHALLENGE:
- Complex stakeholder ecosystem
- Technical and non-technical audiences
- Microsoft 365 integration requirements
- Real-time data visualization needs
- Cross-functional team coordination

TECHNICAL DELIVERY:
- SharePoint site architecture and development
- Power Automate workflows for data collection
- Power BI reporting infrastructure
- Data integration from multiple sources
- Microsoft 365 environment optimization

LEADERSHIP & SOFT SKILLS:
- Stakeholder Management:
  - Foundation executive team
  - Field staff across continents
  - External designers and copywriters
  
- Communication:
  - Technical documentation for IT team
  - Non-technical guides for field staff
  - Executive presentations for board

- Team Coordination:
  - Bridged technical and creative teams
  - Managed conflicting requirements
  - Facilitated consensus building

RIGHT SIDE (55% width):

ARCHITECTURE DIAGRAM:
[Create data flow and stakeholder diagram]

DATA SOURCES:
[Icons for each source]
- Field Reports (SharePoint forms)
- Conservation Metrics (Excel files)
- Financial Data (ERP system)
- Partner NGO Data (APIs)
- Satellite Imagery Metadata
   ↓
[SharePoint icon] SharePoint Hub
Central collaboration platform:
- Document libraries
- Custom lists
- Metadata management
   ↓
[Power Automate icon] Power Automate Workflows
Automation:
- Data validation
- Approval workflows
- Email notifications
- Data transformation
   ↓
[Power BI icon] Power BI Reports & Dashboards

REPORT TYPES:
1. Executive Dashboard
   - Global conservation metrics
   - Budget vs actual
   - Impact visualization

2. Regional Reports
   - Americas, EMEA, APAC
   - Species protection status
   - Habitat restoration progress

3. Financial Reports
   - Donor tracking
   - Project spending
   - Grant utilization

STAKEHOLDER INTERACTION MODEL (show web):
[Center: Technical Lead]
Connected to:
- Foundation Executives (strategy alignment)
- Field Staff (requirements gathering)
- IT Team (technical implementation)
- Designers (UI/UX collaboration)
- Copywriters (content coordination)

KEY SUCCESS FACTORS BOX:
✓ Regular stakeholder check-ins
✓ Iterative feedback loops
✓ Clear documentation at all levels
✓ Patience with non-technical users
✓ Flexible to changing requirements

THE IMPACT:
✓ Data-driven conservation decisions
✓ Improved international collaboration
✓ Real-time initiative tracking
✓ Reduced manual reporting time by 80%
✓ Better visibility for donors
✓ Faster response to critical conservation events

KEY LEARNING:
"Technical excellence + stakeholder management = project success"
Soft skills matter as much as technical skills

FOOTER:
Tech Stack Icons: [SharePoint icon] [Power BI icon] [Power Automate icon] [Microsoft 365 icon] [DAX icon]

---
SLIDE 20: COMBINED COST SAVINGS IMPACT
---
Title: "Total Business Impact: Cost Optimization Results"

Layout: Large visual comparison

TOP SECTION (30% height):

COST OPTIMIZATION PROJECTS SUMMARY:

Project 9: GCP Infrastructure Optimization = €15,000/year
Project 10: APISIX Gateway (Cloud Armor replacement) = $36,000/year (€33,000)
Project 7: AI Agents (Subscription elimination) = €50,000/year (85% reduction)

CENTER SECTION (40% height):

VISUAL COMPARISON (large before/after):

BEFORE OPTIMIZATION:
[Large bar chart]
Annual Cloud & AI Costs: €98,000

Breakdown:
- GCP Infrastructure: €50K
- Cloud Armor: €33K
- Individual AI Subscriptions: €15K

AFTER OPTIMIZATION:
[Smaller bar chart with green color]
Annual Cloud & AI Costs: €0 (for eliminated costs)

Total Eliminated/Optimized:
- GCP Infrastructure: €35K (optimized, €15K saved)
- Cloud Armor: €0 (eliminated, €33K saved)
- AI Subscriptions: ~€2.5K (85% reduction, saved €12.5K estimate)

[HUGE NUMBER in center]
~€98K
Total Annual Value Delivered Through Cost Optimization

APPROACH THEMES (3 pillars):
1. Smart Service Selection
   Open-source when appropriate
   Managed services when needed

2. Continuous Monitoring
   Real-time cost tracking
   Proactive optimization

3. Strategic Architecture
   Design for cost efficiency
   Build vs buy decisions

BOTTOM SECTION (30% height):

BEYOND COST SAVINGS:

IMPROVED CAPABILITIES:
✓ Better API observability (APISIX)
✓ Enhanced security (Crowdsec community intelligence)
✓ Organization-wide AI access (500+ users)
✓ Faster infrastructure provisioning

CULTURAL IMPACT:
✓ Cost-conscious engineering culture
✓ Engineers consider TCO in design
✓ Regular cost reviews in sprints
✓ Data-driven infrastructure decisions

SUSTAINABILITY:
✓ Ongoing optimization (not one-time)
✓ Automated cost monitoring
✓ Continuous improvement process

FOOTER:
"Cost optimization is not about cutting corners—it's about smart architecture and strategic decisions"

---
SLIDE 21: KEY ACHIEVEMENTS SUMMARY
---
Title: "Core Strengths & Career Highlights"

Layout: 6 large cards in 2 rows x 3 columns

CARD 1: REUSABLE ARCHITECTURES
[Icon: Interlocking puzzle pieces]
Designed for Scale from Day One

Details:
- SFTP pipeline deployed across 2 global clients
- 70% time savings on second implementation
- Configuration-driven deployment
- Proven production reliability

CARD 2: ZERO DATA LOSS
[Icon: Shield with checkmark]
Financial Data Protection

Details:
- High-accuracy payment data handling
- Comprehensive validation layers
- Error detection and retry mechanisms
- 100% data integrity maintained

CARD 3: COST EFFICIENCY
[Icon: Trending downward chart]
€98K Annual Value Delivered

Details:
- €15K GCP optimization
- €33K infrastructure savings
- ~€50K AI cost reduction
- Strategic cost-conscious architecture

CARD 4: SECURITY-FIRST
[Icon: Lock with layers]
Enterprise-Grade Security

Details:
- Multiple security-focused projects
- Row-level access control
- Data anonymization pipelines
- Zero data exposure incidents

CARD 5: GLOBAL SCALE
[Icon: World map with pins]
Multi-Continent Operations

Details:
- Clients in Americas, EMEA, APAC
- Worldwide electronics brands
- Global solar panel company
- International conservation foundation

CARD 6: INNOVATION
[Icon: Rocket launching]
AI/ML & Advanced Systems

Details:
- Enterprise RAG implementation
- Multi-level AI agent system
- Vector + Graph + Relational databases
- Cutting-edge technology adoption

BOTTOM BANNER:
"Strategic Engineering: Business Impact Through Technical Excellence"

---
SLIDE 22: PERFECT FIT FOR THE ROLE
---
Title: "Alignment with GCP Data Engineer Position"

Layout: Two-column checklist

LEFT COLUMN: JOB REQUIREMENTS

RIGHT COLUMN: MY EXPERIENCE & EVIDENCE

ROW 1:
Requirement: "6+ years Data Engineer experience"
My Experience: ✓ 6+ years with modern cloud data platforms
Evidence: 10 production projects across multiple industries

ROW 2:
Requirement: "Strong GCP services (BigQuery, Cloud Run, Cloud Functions, Pub/Sub, Cloud Composer)"
My Experience: ✓ Extensive production experience with all mentioned services
Evidence: BigQuery (Projects 1,3,4,5,6), Cloud Run (Projects 1,2,4,5,7,10), Cloud Functions (Project 6), Pub/Sub (Projects 3,5,6), Datastream (Projects 3,4)

ROW 3:
Requirement: "SQL proficiency"
My Experience: ✓ 6 years, Level 4 (can mentor others)
Evidence: Multiple database types (Cloud SQL, AlloyDB, BigQuery), complex queries, optimization

ROW 4:
Requirement: "Python, Java, or Scala (any one needed)"
My Experience: ✓ Python - 7 years, Level 4
Evidence: Primary language for data engineering (Projects 1,2,4,5,7)

ROW 5:
Requirement: "Terraform"
My Experience: ✓ 4 years Infrastructure as Code
Evidence: All infrastructure deployed via Terraform, multi-environment management

ROW 6:
Requirement: "Power BI"
My Experience: ✓ Power BI + Looker Studio experience
Evidence: Project 8 (Power BI), Project 1 (Looker Studio)

ROW 7:
Requirement: "Avro and Parquet data formats"
My Experience: ✓ Familiar with columnar formats
Evidence: Working knowledge, ready to implement extensively

ROW 8:
Requirement: "NoSQL and RDBMS"
My Experience: ✓ Multiple database types, 4-5 years
Evidence: Firestore, Bigtable, Memorystore (NoSQL); Cloud SQL, AlloyDB (RDBMS); Neo4j (Graph); Qdrant (Vector)

ROW 9:
Requirement: "CI/CD pipelines"
My Experience: ✓ Automated deployment pipelines
Evidence: Cloud Run Jobs, Cloud Scheduler, Terraform automation

ROW 10:
Requirement: "Data visualization tools"
My Experience: ✓ Looker Studio, Power BI, Grafana
Evidence: Projects 1, 8, 10

ADDITIONAL VALUE SECTION (highlighted box at bottom):

BEYOND THE REQUIREMENTS:

✓ Cost Optimization Expertise
  €98K proven annual value delivery

✓ Security Specialization
  Multiple security-focused implementations

✓ AI/ML Experience
  RAG systems, Vertex AI, Gemini

✓ Kubernetes & Container Orchestration
  GKE production deployments

✓ API Gateway & Infrastructure
  APISIX, Crowdsec, SRE practices

✓ Global Scale Experience
  Multi-continent client operations

FOOTER:
"Not just meeting requirements—exceeding them with proven expertise"

---
SLIDE 23: WHY STOCKHOLM & THIS OPPORTUNITY
---
Title: "Career Motivation & Cultural Fit"

Layout: Three sections with visual appeal

SECTION 1: CAREER MOTIVATION (top third)
[Icon: Upward trending arrow with GCP logo]

"Career advancement in GCP-focused data engineering role"

What Attracts Me:
- Deep specialization in Google Cloud Platform
- Modern data architectures (DBT, data modeling)
- Working with cloud-native data solutions
- Learning from Swedish tech excellence
- Opportunity to work with cutting-edge data stack
- Growing expertise in data engineering best practices

Perfect Match:
- My GCP expertise aligns perfectly with role requirements
- Proven track record with BigQuery, Datastream, Cloud Run
- Ready to dive deep into DBT and advanced data modeling
- Excited about modern data engineering challenges

SECTION 2: CULTURAL FIT (middle third)
[Icon: Heart with Swedish flag colors]

"Sweden's tech ecosystem and work-life balance"

Why Stockholm:
- Stockholm's innovative and thriving tech scene
- Scandinavian approach to quality engineering
- Work-life balance philosophy
- International, collaborative work environment
- Progressive tech culture and practices
- Focus on sustainability and innovation

Cultural Alignment:
- Appreciate Swedish values: honesty, equality, pragmatism
- Cost-conscious mindset fits Swedish business culture
- Collaborative approach to problem-solving
- Quality over quantity engineering philosophy

SECTION 3: COMMITMENT TO RELOCATION (bottom third)
[Icon: Location pin with arrow]

"Relocating to Stockholm is exactly what I'm aiming for"

Current Status:
📍 Lisbon, Portugal (D3 work visa holder)
🎯 Targeting Stockholm specifically for career + lifestyle

Relocation Plan:
- Ready to relocate upon Swedish work permit approval
- Can start remotely during visa processing (2-4 months typical)
- Fully committed to long-term move (not temporary)
- Already researching Stockholm neighborhoods and Swedish culture

Why This Matters:
This isn't just a job opportunity—it's the specific career and lifestyle move I'm targeting.
Stockholm represents both professional growth and personal goals.

FOOTER:
"Committed, Qualified, and Ready to Contribute from Day One"

---
SLIDE 24: PRACTICAL DETAILS & AVAILABILITY
---
Title: "Logistics & Next Steps"

Layout: Clean informational cards

CARD 1: CURRENT SITUATION
[Icon: Briefcase]
Title: "Professional Background"

📍 Current Location: Lisbon, Portugal
💼 Experience Level: 6+ years Data Engineering
🎓 Background: Software Engineer & GCP Architect
🏢 Companies: Lagoasoft | MMW
🔧 Focus: Cloud-native data solutions on GCP

CARD 2: VISA & RELOCATION
[Icon: Passport/Globe]
Title: "Relocation Details"

🛂 Current Visa: Portugal D3 work visa (valid)
🇸🇪 Requirement: Swedish work permit (sponsorship needed)
✈️ Timeline: Ready to relocate upon visa approval
💻 Flexibility: Can start remotely during visa processing (2-4 months)
🏠 Commitment: Long-term relocation, not temporary assignment
📋 Understanding: Aware visa sponsorship is offered by company

CARD 3: AVAILABILITY & START DATE
[Icon: Calendar]
Title: "Timeline & Availability"

⏰ Notice Period: Flexible - ASAP upon visa approval
📅 Remote Start: Can begin within 2-4 weeks (during visa processing)
🏢 Onsite Start: Upon Swedish work permit approval
📞 Interview Availability: Weekdays 9:00-18:00 CET (same timezone!)
🌐 Time Zone: Currently CET (Lisbon) - same as Stockholm

CARD 4: COMPENSATION
[Icon: Money/Chart]
Title: "Salary Expectations"

Current Compensation: €40,000 annually (Lisbon market)
Target Market Research: €50-70K for this role in Stockholm
Approach: Open to discussion based on total compensation package
Understanding: Swedish salaries consider total value (salary + benefits + work-life balance)
Flexibility: Willing to discuss fair market compensation for Stockholm

CARD 5: CONTACT INFORMATION
[Icon: Contact/Message]
Title: "Get in Touch"

📧 Email: [your.email@example.com]
💼 LinkedIn: [linkedin.com/in/yourprofile]
📱 Phone: [+351 XXX XXX XXX]
🌐 Portfolio: [Optional - if you have one]

Preferred Contact: Email or LinkedIn
Response Time: Within 24 hours for all inquiries

BOTTOM SECTION:

WHAT I BRING TO THE TEAM:
- Immediate technical contribution (minimal ramp-up time)
- Proven GCP expertise aligned with role requirements
- Cost-conscious, business-minded engineering approach
- Security-first mindset with compliance awareness
- Collaborative, team-oriented work style
- Enthusiasm for Swedish work culture and values

NEXT STEPS I'M READY FOR:
✓ Technical interview / portfolio review
✓ Team meet & greet
✓ Architecture / system design discussion
✓ Cultural fit conversation
✓ Visa sponsorship process initiation

---
SLIDE 25: CLOSING SLIDE
---
Design: Clean, professional, memorable

MAIN CONTENT (centered):

"Thank You"

[Your Full Name]
GCP Architect & Senior Data Engineer

"Ready to bring data engineering excellence to Stockholm"

TAGLINE:
"Proven Impact • GCP Expertise • Cost-Conscious Innovation"

QUICK HIGHLIGHTS (subtle, bottom third):
- 10 Production Projects
- €98K Annual Value Delivered
- 6+ Years GCP Experience
- Security-First Approach
- Global Scale Operations

CONTACT (prominent but elegant):
📧 [your.email@example.com]
💼 [LinkedIn Profile]
📱 [Phone Number]

CALL TO ACTION:
"Let's discuss how I can contribute to your data engineering initiatives"

VISUAL ELEMENTS:
- Subtle Stockholm skyline silhouette in background
- OR subtle GCP cloud pattern
- Professional but warm color scheme
- Ensure contact information is clearly readable

FOOTER (very subtle):
"Available for immediate discussion | Flexible start date | Committed to Stockholm"

=== DESIGN IMPLEMENTATION NOTES ===

For Google AI Studio / Gemini Pro 3:

1. ARCHITECTURE DIAGRAMS:
   - Use boxes and arrows with clear labels
   - Include official GCP service icons (BigQuery, Cloud Run, Datastream, etc.)
   - Show data flow direction clearly
   - Use callout boxes for important details
   - Keep diagrams uncluttered - one main flow per slide

2. COLOR USAGE:
   - Blue (#1A73E8) for headers, GCP elements, primary paths
   - Green (#34A853) for success metrics, cost savings, checkmarks
   - Orange (#FBBC04) for warnings, highlights, innovation elements
   - Gray for secondary text and supporting information
   - White backgrounds with subtle gradients

3. TYPOGRAPHY HIERARCHY:
   - Slide titles: 36-44pt, bold
   - Section headers: 24-28pt, bold
   - Body text: 18-20pt, regular
   - Metrics: 60-72pt, extra bold
   - Diagram labels: 14-16pt, regular

4. ICON USAGE:
   - Use official Google Cloud service icons wherever possible
   - Consistent icon style across all slides
   - Icons should support, not overwhelm text
   - Technology logos at actual size, not distorted

5. WHITESPACE:
   - Generous margins (minimum 5% on all sides)
   - Space between sections
   - Don't overcrowd slides
   - Scandinavian minimalism principle

6. CONSISTENCY:
   - Same header treatment across all content slides
   - Consistent footer with tech stack icons
   - Similar layout patterns for similar content types
   - Unified color scheme throughout

7. VISUAL HIERARCHY:
   - Most important information largest
   - Supporting details smaller
   - Clear visual separation between sections
   - Guide eye through content flow

8. DIAGRAMS SPECIFIC NOTES:
   - Use rectangles for services/systems
   - Use arrows with labels for data flow
   - Use diamonds for decision points
   - Use clouds for external systems
   - Use cylinders for databases
   - Color-code by function (storage=blue, compute=orange, security=green)

TOTAL SLIDE COUNT: 25 slides
- Title: 1
- Summary: 1  
- Skills: 1
- Section Dividers: 5
- Project Details: 10 (one per project)
- Achievements: 1
- Alignment: 1
- Motivation: 1
- Logistics: 1
- Cost Impact: 1
- Leadership: 1
- Closing: 1

OUTPUT FORMAT:
Generate a complete, production-ready PowerPoint presentation following these specifications exactly. Each slide should be polished and ready for presentation to Swedish hiring managers. Focus on visual impact, clarity, and professional execution.