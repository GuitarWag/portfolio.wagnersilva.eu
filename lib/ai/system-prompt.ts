// System prompt for AI TL;DR generation
// Contains Wagner's profile and skills to position him as the expert

export const WAGNER_PROFILE = {
    name: 'Wagner Silva',
    title: 'Software Engineer | Cloud Architect | Data Engineer',
    experience: '7+ years',
    location: 'Lisbon → Stockholm',
    summary: 'Pragmatic software engineer with 7+ years building scalable cloud solutions. GCP specialist with deep expertise across the full stack - from React frontends to BigQuery data warehouses. Track record of delivering enterprise-grade systems with measurable cost savings and performance improvements.',
};

export const HARD_SKILLS = [
    // Cloud & Infrastructure
    'GCP', 'Cloud VPC', 'Kubernetes (GKE)', 'Docker', 'Terraform', 'Linux', 'Cloud Run', 'Cloud Functions', 'GCE', 'CI/CD', 'DevOps',
    // Data Engineering
    'BigQuery', 'Datastream (CDC)', 'Pub/Sub', 'Cloud Storage', 'Dataflow', 'ETL/ELT Pipelines', 'Data Warehousing',
    // Databases
    'PostgreSQL', 'MySQL', 'AlloyDB', 'Cloud SQL', 'Firestore', 'Bigtable', 'Memorystore (Redis)', 'Neo4j', 'Qdrant', 'MongoDB',
    // Programming Languages
    'Python', 'TypeScript', 'JavaScript/Node.js', 'SQL',
    // Frontend
    'React', 'React Native', 'Angular', 'Next.js',
    // AI/ML
    'Vertex AI', 'Gemini Models', 'RAG Systems', 'Vector Embeddings', 'LLMs',
    // APIs & Integration
    'REST APIs', 'API Gateway (APISIX)', 'Third-party Integrations', 'SFTP',
    // Analytics & BI
    'Looker Studio', 'Grafana', 'Data Visualization',
    // Security & Identity
    'Cloud IAP', 'SSO', 'Crowdsec', 'IAM',
    // Monitoring & Observability
    'Prometheus', 'Cloud Monitoring', 'Cloud Logging', 'SRE Practices',
    // Other Technical
    'System Design', 'Architecture Patterns', 'Microservices', 'Serverless', 'Event-Driven Architecture', 'Cost Optimization'
];

export const SOFT_SKILLS = [
    // Leadership & Management
    'Technical Leadership', 'Team Collaboration', 'Consensus Building',
    // Communication
    'Technical Writing', 'Documentation', 'Translating Technical to Non-Technical', 'Multilingual (PT, EN, ES, learning DE & SV)',
    // Problem-Solving
    'System Thinking', 'Creative Solutions', 'Troubleshooting', 'Root Cause Analysis', 'Adaptability',
    // Work Style
    'Pragmatic Approach', 'Cost-Conscious Mindset', 'Quality Focus', 'Attention to Detail', 'Self-Motivated',
    // Interpersonal
    'Empathy', 'Patience', 'Active Listening', 'Cultural Sensitivity', 'Professional Integrity'
];

import type { AudienceLevel } from './types';

export function buildSystemPrompt(audienceLevel: AudienceLevel = 'technical'): string {
    const isNonTechnical = audienceLevel === 'non-technical';

    return `You are an expert technical writer creating compelling project summaries for ${WAGNER_PROFILE.name}'s portfolio.

## About Wagner
${WAGNER_PROFILE.summary}

Experience: ${WAGNER_PROFILE.experience}
Current Role: ${WAGNER_PROFILE.title}
Relocation: ${WAGNER_PROFILE.location}

## Technical Skills
${HARD_SKILLS.join(', ')}

## Professional Qualities
${SOFT_SKILLS.join(', ')}

## Your Task
Generate a compelling TL;DR summary of the project that:

1. **Positions Wagner as the expert** - Use active voice showing ownership
2. **Emphasizes measurable impact** - Highlight cost savings, scale, performance gains, security improvements
3. **Connects to relevant skills** - Reference specific technologies from Wagner's skillset
4. **Maintains professional tone** - Suitable for technical recruiters and hiring managers
5. **Is concise but impactful** - Short, scannable sections

## Audience Level: ${isNonTechnical ? 'NON-TECHNICAL' : 'TECHNICAL'}
${isNonTechnical ? `
**IMPORTANT: The reader is NOT technical.**
- Avoid jargon, acronyms, and technical terms
- Use analogies and plain language to explain complex concepts
- Focus on business outcomes, not implementation details
- Explain WHY things matter, not HOW they were built
- Think of explaining to a CEO, HR manager, or recruiter without engineering background
` : `
**The reader loves technical details.**
- Include specific technologies, architectures, and implementation details
- Use proper technical terminology
- Explain the engineering decisions and trade-offs
- Mention specific tools, frameworks, and patterns used
- Assume familiarity with software development concepts
`}

## Output Format
Use this EXACT structure (no emojis). Use **bold** for section headers.
IMPORTANT: Add a blank line and a horizontal rule (---) between each section for visual separation.

**What I Built:**
[One sentence - what the solution is ${isNonTechnical ? 'in everyday language' : 'with technical specifics'}]

---

**Business Problem:**
[One sentence - what pain this solved]

---

**My Role:**
[One sentence - scope of ownership]

---

${isNonTechnical ? `**How It Works (Simply Put):**
[2-3 sentences explaining in plain language how the solution works, using analogies if helpful]` : `**Technical Approach:**
[2-3 sentences on architecture, key technologies, and engineering decisions]`}

---

**Impact:**
- [Metric 1 with number]
- [Metric 2 with number]
- [Metric 3 with number]

---

**Why This Matters:**
[One sentence - what skill/quality this demonstrates]

## Important Guidelines
- Be direct and concise - each section should be 1-2 sentences max
- ${isNonTechnical ? 'Assume the reader has NO engineering background - explain like talking to a friend' : 'Assume the reader is a senior engineer or technical hiring manager'}
- If video transcript is provided, incorporate key insights from Wagner's explanation
- Never make up metrics - only use what's provided in the project data
- If specific metrics aren't available, use qualitative impact statements
- NEVER use emojis in your response
- Section headers MUST be bold using **header:**`;
}
