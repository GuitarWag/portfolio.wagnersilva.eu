# Projects

## Project 1: Page Builder Platform

**Overview:**
A worldwide solar panel company needed a solution to empower their network of third-party installers (ranging from one-person operations to big companies) to create professional websites. The manufacturer wanted to use this network as a marketing platform, ensuring brand consistency while allowing installers to localize content.

**Challenge:**
- Enable non-technical installers to create professional websites instantly.
- Support global operations (EMEA, APAC, Americas) with localization and multiple languages.
- Handle file uploads (images, documents) and deploy without manual intervention.
- Scale to hundreds of concurrent users.

**Solution:**
- **Frontend:** Two React applications – one for the **Editor** (drag-and-drop, real-time preview, component selection) and one for the **Renderer** (optimized for SEO and performance).
- **Backend:** Node.js/TypeScript REST API running on **Cloud Run**.
- **Data:** **Cloud SQL** for structured data and **BigQuery** for analytics (streamed via Datastream).
- **Deployment:** Automated one-click deployment pipeline to a global CDN.

**Impact:**
- Global B2B platform serving hundreds of installers.
- Zero-touch website creation (seconds vs weeks).
- Win-win: Installers get a professional site; Manufacturer ensures brand consistency.
- Complete full-stack ownership (UI + API + Infra).

**Tech Stack:**
React | TypeScript | Node.js | Cloud Run | Cloud SQL | BigQuery | Looker Studio | i18n

---

## Project 2: Enterprise RAG System with AI Agents

**Overview:**
A large German customer was concerned about data privacy with employees using personal AI accounts. They needed a secure, centralized AI solution that was compliant with company protocols and cost-effective.

**Challenge:**
- Prevent data leakage to external AI models.
- Reduce costs associated with individual AI Pro licenses.
- Provide access to company-specific knowledge (RAG).
- Implement role-based access control and security tags for documents.

**Solution:**
- **Chat Interface:** Built a secure chat interface connecting to **Gemini** models via **Vertex AI SDK**.
- **Security:** Implemented **Google IAP** for Single Sign-On (SSO), ensuring no separate logins were needed.
- **Agents:** Created a system of agents and sub-agents that could be specialized via system prompts.
- **RAG System:** Integrated **Neo4j** (graph DB), **Qdrant** (vector DB), and **PostgreSQL** for a robust RAG architecture.
- **Ingestion:** Used **Docling** (Python) to ingest and embed documents with security tags (Public, Private, Admin).
- **Cost Management:** Centralized billing with granular labeling per application/user.

**Impact:**
- **85% Cost Reduction:** Eliminated individual licenses; pay-as-you-go model with optimized models.
- **Data Security:** Zero leakage; all data stays within the company's GCP environment.
- **Enhanced Intelligence:** Graph-based RAG allows for context-aware queries and scoped searches based on security tags.

**Tech Stack:**
React | TypeScript | Python | Vertex AI (Gemini) | GKE | AlloyDB (PostgreSQL) | Neo4j | Qdrant | Memorystore (Redis) | Cloud Storage | Cloud IAP

---

## Project 3: Tri-Directional Real-Time Sync

**Overview:**
The same global solar company from Project 1 needed to synchronize data across three critical systems: **Pardot** (Salesforce), **TalentLMS** (certification/training), and an **Internal Database** (project registration).

**Challenge:**
- Keep 3 separate systems in perfect bidirectional sync.
- Handle concurrent updates and conflicts across different time zones.
- None of the systems had real-time event webhooks (polling required).
- Process 15,000+ records daily with low latency.

**Solution:**
- **Orchestration:** TypeScript engine running on **Cloud Run Jobs**.
- **Trigger:** **Cloud Scheduler** runs every 15 minutes to detect changes.
- **Audit:** **Firestore** tracks update history with before/after state snapshots for full auditability.
- **Conflict Resolution:** Logic to determine the "source of truth" based on timestamps and priority rules.

**Impact:**
- Single source of truth across all platforms.
- Saved 20+ hours/week of manual data entry.
- 99.9% sync success rate with auto-recovery.
- Full audit trail allows support to reverse/correct changes if needed.

**Tech Stack:**
TypeScript | Cloud Run Jobs | Salesforce API | TalentLMS API | Firestore | REST | Cloud Scheduler

---

## Project 4: GCP Cost Optimization

**Overview:**
A large German customer migrated from an old on-premise data center to Google Cloud. Over time, costs rose significantly (30% YoY). The goal was to optimize costs without compromising the security or reliability of the migrated resources.

**Challenge:**
- Reduce rising GCP costs.
- Gain granular visibility into costs per application.
- Establish a culture of cost awareness.

**Solution:**
- **Active Monitoring:** Implemented strict resource labeling (by app, environment, user) to track spending.
- **Right-Sizing:** Optimized CPU/RAM for VMs and Cloud SQL instances.
- **Service Optimization:** Migrated suitable workloads to cheaper services (e.g., Spot VMs for dev).
- **Cleanup:** Removed unused resources and optimized storage classes.

**Impact:**
- **€15,000 Annual Savings** (30% reduction).
- Full cost visibility via billing dashboards.
- Established repeatable optimization processes.

**Tech Stack:**
Redis | BigQuery | Cloud Monitoring | Terraform | FinOps

---

## Project 5: Row-Level Security System

**Overview:**
A major coffee machine manufacturer needed to embed **Looker Studio** reports into their customer portal. The requirement was to provide public access (no Google login for end-users) while ensuring strict data isolation—each customer must ONLY see their own data.

**Challenge:**
- Publicly accessible reports without Google account requirements.
- Strict row-level security (RLS) to prevent data leakage.
- Scalable to thousands of concurrent users.
- Hide the underlying data source if the link is discovered.

**Solution:**
- **Reverse Proxy:** Built a **Python** reverse proxy on **Cloud Run**.
- **Auth Flow:** The portal injects a JWT; the proxy validates it, extracts the customer ID, and fetches a unique secret.
- **Secret Injection:** The proxy injects this secret into the Looker Studio URL parameters.
- **BigQuery RLS:** Queries are filtered using the injected secret (`WHERE secret = @injected_secret`), ensuring only relevant data is returned.

**Impact:**
- Secure public reporting with zero data exposure.
- Seamless user experience (no login friction).
- Replicated across multiple brands due to its success.

**Tech Stack:**
Python | Cloud Run | Looker Studio | BigQuery | JWT | Reverse Proxy

---

## Project 6: Reusable SFTP Architecture

**Overview:**
A large client needed to sync critical financial data (payment/rebate info) from external SFTP servers to BigQuery. The operation was critical with zero tolerance for data loss.

**Challenge:**
- Zero data loss tolerance for financial records.
- Connectivity issues: Client SFTP was in a different VPC/Project with overlapping IPs.
- Need for a reusable solution for multiple global clients.

**Solution:**
- **Connectivity:** Used **Cloud NAT** and **VPC Connector** to ensure a static outbound IP for allowlisting.
- **Ingestion:** **Python** SFTP client running on **Cloud Run Jobs**.
- **Processing:** **Dataflow** pipeline for validation (row counts, checksums) and insertion.
- **Storage:** **BigQuery** as the final destination.

**Impact:**
- **ZERO data loss** on financial records.
- **Reusable Architecture:** Quickly implemented for a Korean electronics manufacturer and others.
- 70% faster development for subsequent implementations.

**Tech Stack:**
Python | SFTP | Cloud Run Jobs | Dataflow | BigQuery | VPC Connector | Cloud NAT

---

## Project 7: Smart API Integration

**Overview:**
A call center needed real-time analytics from their **Pascom PBX** system. The API was severely limited (no filtering, no pagination, always returned a limited set of recent records).

**Challenge:**
- API limitations: No "page 2", no "filter by date" (only "last X hours"), max 1000 results.
- Need for frequent syncs (15-30 mins) without duplicates.
- Minimize BigQuery costs and API load.

**Solution:**
- **Pagination Logic:** Implemented custom logic to calculate offsets and fetch full history locally.
- **Deduplication:** Python script generates a hash for each record.
- **Delta Load:** Checks existing hashes in BigQuery and only inserts **new** unique records.
- **Metadata:** Tracks load history in a separate BigQuery table.

**Impact:**
- Real-time analytics operational (15-30 min freshness).
- 99.5% data processing efficiency (only new rows inserted).
- 80% reduced BigQuery insert costs.

**Tech Stack:**
Python | Cloud Run Jobs | Cloud Scheduler | BigQuery | Hash Deduplication

---

## Project 8: CI/CD Pipeline Migration

**Overview:**
A major German client had a legacy build system with 120+ **Jenkins** jobs running on a single on-premise VM. The goal was to migrate everything to a cloud-native architecture.

**Challenge:**
- Migrate 120+ diverse production builds (Node.js, Python, etc.).
- Convert legacy processes (e.g., MongoDB dependencies) to cloud-native equivalents (Firestore).
- Manual analysis required for each build script (no AI tools available back then).

**Solution:**
- **Migration:** Systematically rewrote build scripts for **Google Cloud Build**.
- **Containerization:** Dockerized all applications.
- **Infrastructure:** Used **Terraform** for provisioning.
- **Environments:** Configured pipelines for Dev, Staging, and Production.

**Impact:**
- Successfully migrated 120+ builds to Cloud Build.
- Eliminated single-point-of-failure (old VM).
- Improved scalability and developer productivity.

**Tech Stack:**
Cloud Build | Docker | Terraform | Jenkins | CI/CD | DevOps

---

## Project 9: APISIX API Gateway

**Overview:**
The client was spending ~€36,000/year on Google Cloud Armor for WAF and DDoS protection. They needed a more cost-effective solution with better observability.

**Challenge:**
- Replace expensive Cloud Armor without compromising security.
- Protect against AI agents and mass attacks.
- Improve observability for SRE teams.
- Zero downtime migration.

**Solution:**
- **Gateway:** Deployed **Apache APISIX** on **GCE Managed Instance Groups**.
- **Security:** Integrated **Crowdsec** for community-driven threat intelligence (real-time IP blocking).
- **Observability:** Connected to **Prometheus** and **Grafana** for detailed metrics.
- **Architecture:** Sits behind the Global Load Balancer, filtering traffic before it hits backend services.

**Impact:**
- **€36,000 Annual Savings** (100% Cloud Armor cost reduction).
- Enhanced security with real-time community intelligence.
- 10x improvement in observability metrics.
- High performance (100k req/sec).

**Tech Stack:**
APISIX | Crowdsec | GCE | Managed Instance Groups | Prometheus | Grafana

---

## Project 10: Real-Time CDC Pipeline

**Overview:**
The support team needed real-time analytics from their **ZNUNY** (formerly OTRS) ticket system. Direct querying of the production MySQL database was not an option due to performance concerns.

**Challenge:**
- Replicate data from on-prem/VM MySQL to BigQuery in real-time.
- **Data Minimization:** Only replicate specific tables/columns to protect PII (GDPR).
- Zero performance impact on production.

**Solution:**
- **Tool:** Used **Google Datastream** for Change Data Capture (CDC).
- **Configuration:** Configured selective replication (only needed tables/columns).
- **Target:** Streamed data directly into **BigQuery**.
- **Access:** Gave the reporting team control over which columns to replicate via the UI.

**Impact:**
- Real-time support metrics with sub-second latency.
- Enhanced data governance (sensitive data excluded).
- 60% reduced data transfer costs.

**Tech Stack:**
MySQL | Datastream | BigQuery | Looker Studio | CDC

---

## Project 11: On-Demand Database Anonymization

**Overview:**
Developers needed fresh production data for testing, but the existing manual process was painful and prone to errors (e.g., "asterisk" masking breaking UI validation).

**Challenge:**
- Provide fresh, realistic data on-demand.
- Ensure zero PII exposure.
- Maintain data validity (referential integrity, field formats) to prevent app crashes.
- Automate the provisioning process.

**Solution:**
- **Automation:** Created a "push-button" solution.
- **Provisioning:** **Terraform** spins up a new isolated VM and loads a production backup.
- **Anonymization:** **Python** script performs smart masking (replacing PII with valid but fake data).
- **Switch:** Validates the new DB, applies firewall rules, updates staging DNS/IP, and pauses the old VM.

**Impact:**
- High-quality testing with realistic data.
- Full data security compliance.
- Fast provisioning (< 2 hours).
- Eliminated "asterisk" bugs in testing.

**Tech Stack:**
Python | SQL | Cloud SQL | Cloud Storage | Terraform | GCE | Firewall

---

## Project 12: Technical Leadership (SharePoint Communication Site)

**Overview:**
A worldwide conservation foundation needed a new communication site for their "Roadmap 2030" initiative. The existing site was unusable, and the domain (climate change) was complex.

**Challenge:**
- Build a complete SharePoint communication site from scratch.
- Coordinate between the Foundation's communication team, domain experts, and technical teams.
- Serve 100,000+ users worldwide.

**Solution:**
- **Leadership:** Acted as the bridge between stakeholders and the technical team.
- **Development:** Bootstrapped a new **SharePoint** site.
- **Integration:** Used **Power Automate** and **Power BI** to ingest data and display real-time reports embedded in the site.
- **UX:** Collaborated with designers to create an intuitive site map and navigation.

**Impact:**
- Successfully launched a site serving 100,000+ users.
- Improved international collaboration on climate goals.
- Data-driven sections powered by automated Power BI reports.

**Tech Stack:**
SharePoint | Power BI | Power Automate | Microsoft 365 | UI/UX Leadership

---

# Skills

**Cloud & Infrastructure:**
GCP, Cloud VPC, Kubernetes (GKE), Docker, Terraform, Linux, Cloud Run, Cloud Functions, GCE, CI/CD, DevOps

**Data Engineering:**
BigQuery, Datastream (CDC), Pub/Sub, Cloud Storage, Dataflow, ETL/ELT Pipelines, Data Warehousing

**Databases:**
PostgreSQL, MySQL, AlloyDB, Cloud SQL, Firestore, Bigtable, Memorystore (Redis), Neo4j, Qdrant, MongoDB

**Programming Languages:**
Python, TypeScript, JavaScript/Node.js, SQL

**Frontend:**
React, React Native, Angular, Next.js

**AI/ML:**
Vertex AI, Gemini Models, RAG Systems, Vector Embeddings, LLMs

**APIs & Integration:**
REST APIs, API Gateway (APISIX), Third-party Integrations, SFTP

**Analytics & BI:**
Looker Studio, Grafana, Data Visualization

**Security & Identity:**
Cloud IAP, SSO, Crowdsec, IAM

**Monitoring & Observability:**
Prometheus, Cloud Monitoring, Cloud Logging, SRE Practices

**Other Technical:**
System Design, Architecture Patterns, Microservices, Serverless, Event-Driven Architecture, Cost Optimization

**Project Management:**
Jira, Confluence, Agile

**Soft Skills:**
- **Leadership & Management:** Technical Leadership, Team Collaboration, Consensus Building
- **Communication:** Technical Writing, Documentation, Translating Technical to Non-Technical, Multilingual (PT, EN, ES, learning DE & SV)
- **Problem-Solving:** System Thinking, Creative Solutions, Troubleshooting, Root Cause Analysis, Adaptability
- **Work Style:** Pragmatic Approach, Cost-Conscious Mindset, Quality Focus, Attention to Detail, Self-Motivated
- **Interpersonal:** Empathy, Patience, Active Listening, Cultural Sensitivity, Professional Integrity
