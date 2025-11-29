import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { allProjects } from '@/lib/portfolio';
import type { ProjectData } from '@/lib/portfolio/types';
import { db } from '@/lib/firebase';
import { rateLimiter, RateLimitPresets, getClientIdentifier } from '@/lib/rate-limit';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });

export interface RecommendRequest {
    userInput: string;
}

export interface RecommendResponse {
    recommendations: {
        projectId: string;
        title: string;
        subtitle: string;
        reason: string;
        relevanceScore: number;
    }[];
    message: string;
    error?: string;
}

async function generateRecommendations(userInput: string, projects: ProjectData[]): Promise<string> {
    const systemPrompt = buildSystemPrompt(projects);
    const userPrompt = `User is looking for: "${userInput}"

Based on this input, recommend the TOP 3 most relevant projects from Wagner's portfolio. Consider:
- Keywords matching technologies, problems, or domains
- Project category alignment (full-stack, data engineering, security, AI/ML, etc.)
- Technical skills demonstrated
- Business impact and scale

Return ONLY a valid JSON array with this EXACT structure (no markdown, no backticks, no extra text):
[
  {
    "projectId": "project-id-here",
    "reason": "One sentence explaining why this project matches their interest",
    "relevanceScore": 95
  }
]

IMPORTANT:
- Return ONLY the JSON array, nothing else
- relevanceScore should be 0-100 (higher = more relevant)
- reason should be ONE concise sentence
- Recommend max 3 projects, ordered by relevance (highest first)`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
            maxOutputTokens: 2048,
        },
    });

    // Check for blocked content or incomplete response
    if (response.promptFeedback?.blockReason) {
        console.error('Content blocked:', response.promptFeedback.blockReason);
        throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
    }

    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        console.error('Unexpected finish reason:', finishReason);
        // Don't throw, just log - we'll try to parse what we got
    }

    const text = response.text?.trim() || '';

    // Clean up any markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    console.log('AI Response (cleaned):', cleanedText);

    return cleanedText;
}

function buildSystemPrompt(projects: ProjectData[]): string {
    const projectsData = projects.map(p => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        category: p.category,
        tags: p.tags,
        challenge: p.challenge.join(' '),
        solution: p.solution.join(' '),
        impact: p.impact.join(' '),
    }));

    return `You are an intelligent portfolio advisor with deep technical understanding. Your job is to analyze user queries semantically and match them against Wagner Silva's project portfolio based on actual skills, technologies, and problem domains demonstrated in each project.

## Available Projects
${JSON.stringify(projectsData, null, 2)}

## Semantic Matching Methodology

### Step 1: Extract Intent from User Query
Identify what the user is looking for:
- **Specific technologies** (e.g., "React", "Python", "BigQuery", "Docker")
- **Problem domains** (e.g., "real-time sync", "cost optimization", "security", "AI chatbot")
- **Capabilities** (e.g., "data pipelines", "API integration", "frontend development")
- **Project types** (e.g., "full-stack apps", "infrastructure projects", "AI/ML systems")

### Step 2: Analyze Each Project Deeply
For each project, understand:
1. **Core Technologies Used**: Look at tags - these are the actual technologies used in the project
2. **Technical Capabilities Demonstrated**: What skills does this project prove?
   - Frontend development (React, Angular, UI/UX)
   - Backend development (Node.js, Python, FastAPI, APIs)
   - Data engineering (ETL, CDC, BigQuery, data pipelines)
   - Cloud infrastructure (GCP services, Terraform, Kubernetes)
   - AI/ML (Vertex AI, RAG, embeddings, LLMs)
   - Security (authentication, RLS, IAP, encryption)
   - DevOps (CI/CD, Docker, deployment automation)
3. **Problem Domain**: What business problem did it solve?
4. **Architecture Patterns**: What design patterns and approaches were used?

### Step 3: Semantic Relevance Scoring (0-100)

**95-100 (Exceptional Match)**:
- User's primary technology/skill is explicitly in project tags
- Project deeply demonstrates that capability (not just mentioned)
- Problem domain also aligns with user's interest
- Example: User asks "React" → Project has React in tags + is a React-focused frontend project

**85-94 (Strong Match)**:
- User's technology is in tags OR closely related technology is central to project
- Project demonstrates related skills in the same domain
- Example: User asks "frontend development" → Project used React (frontend framework)

**70-84 (Good Match)**:
- Project demonstrates skills in the same technical category
- Related but not exact technology match
- Example: User asks "data warehousing" → Project uses BigQuery (data warehouse)

**60-69 (Moderate Match)**:
- Project category aligns but specific technology differs
- Transferable skills demonstrated
- Example: User asks "databases" → Project uses Cloud SQL, PostgreSQL

**Below 60 (Weak/No Match)**:
- Different technology domain entirely
- No semantic relationship between query and project
- DO NOT RECOMMEND - return empty array [] if all projects score below 60

### Step 4: Context-Aware Matching

**Technology Synonyms & Related Concepts** (understand these relationships):
- "React" relates to: frontend, UI, JavaScript, TypeScript, web apps, SPA
- "Python" relates to: backend, data science, automation, APIs, FastAPI
- "AI" relates to: ML, LLMs, Vertex AI, RAG, embeddings, Gemini, chatbots, NLP
- "data engineering" relates to: ETL, pipelines, BigQuery, Datastream, CDC, data warehouse
- "cloud" relates to: GCP, AWS, infrastructure, serverless, Cloud Run, Kubernetes
- "API" relates to: REST, integration, microservices, backend, endpoints
- "security" relates to: authentication, authorization, RLS, IAP, encryption, SSO
- "cost optimization" relates to: infrastructure, GCP, resource management, efficiency

**Category Understanding**:
- full-stack: Frontend + Backend together (React + Node.js, UI + API)
- data-integration: Moving data between systems (ETL, sync, CDC)
- orchestration: Coordinating multiple systems/processes
- ai-ml: Artificial intelligence and machine learning capabilities
- infrastructure: Cloud platforms, DevOps, deployment
- security: Authentication, authorization, data protection
- devops: CI/CD, automation, deployment pipelines
- leadership: Project management, stakeholder coordination

### Step 5: Quality Filters

- **Minimum Score**: Only recommend if relevance >= 60
- **Maximum Results**: Return 1-3 projects (quality over quantity)
- **Ordering**: Always order by relevance score (highest first)
- **Empty Results**: If no projects score >= 60, return []

## Response Format
Return ONLY a valid JSON array (no markdown, no code blocks, no explanations).

Each recommendation must include:
- projectId: exact ID from available projects
- reason: ONE clear sentence explaining the semantic match (mention specific technology/skill from tags)
- relevanceScore: 0-100 integer based on semantic analysis above

Example output:
[
  {
    "projectId": "page-builder",
    "reason": "Full-stack platform built with React for frontend and Node.js/TypeScript backend APIs.",
    "relevanceScore": 98
  }
]

If no relevant matches: []`;
}

export async function POST(request: NextRequest): Promise<NextResponse<RecommendResponse>> {
    try {
        // Rate limiting check
        const clientId = getClientIdentifier(request);
        const { limit, windowMs } = RateLimitPresets.STANDARD; // 10 requests per minute
        const rateLimitResult = rateLimiter.check(clientId, limit, windowMs);

        // Add rate limit headers to response
        const headers = {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
        };

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                {
                    recommendations: [],
                    message: 'Too many requests. Please wait a moment before trying again.',
                    error: 'Rate limit exceeded',
                },
                {
                    status: 429,
                    headers: {
                        ...headers,
                        'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
                    },
                }
            );
        }

        const body: RecommendRequest = await request.json();
        const { userInput } = body;

        if (!userInput || userInput.trim().length === 0) {
            return NextResponse.json(
                {
                    recommendations: [],
                    message: 'Please describe what kind of projects you\'re interested in.',
                    error: 'Empty input'
                },
                { status: 400, headers }
            );
        }

        const aiResponse = await generateRecommendations(userInput, allProjects);

        let parsedRecommendations: any[];
        try {
            parsedRecommendations = JSON.parse(aiResponse);
        } catch (parseError) {
            console.error('Failed to parse AI response:');
            console.error('Response length:', aiResponse.length);
            console.error('Response preview:', aiResponse.substring(0, 500));
            console.error('Response end:', aiResponse.substring(Math.max(0, aiResponse.length - 200)));
            throw new Error('AI returned invalid JSON format - response may be truncated');
        }

        // Enrich recommendations with project details
        const recommendations = parsedRecommendations
            .map((rec: any) => {
                const project = allProjects.find(p => p.id === rec.projectId);
                if (!project) return null;

                return {
                    projectId: rec.projectId,
                    title: project.title,
                    subtitle: project.subtitle,
                    reason: rec.reason,
                    relevanceScore: rec.relevanceScore || 0,
                };
            })
            .filter((rec): rec is NonNullable<typeof rec> => rec !== null)
            .slice(0, 3); // Ensure max 3

        const message = recommendations.length > 0
            ? `Found ${recommendations.length} relevant project${recommendations.length > 1 ? 's' : ''} for you!`
            : 'I couldn\'t find projects that directly match your search. Try different keywords or browse all 12 projects by scrolling down.';

        // Save query and results to Firestore (non-blocking)
        const queryData = {
            query: userInput,
            recommendationCount: recommendations.length,
            recommendations: recommendations.map(r => ({
                projectId: r.projectId,
                relevanceScore: r.relevanceScore
            })),
            createdAt: new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || '',
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        };

        // Don't await - save in background to not slow down response
        db.collection('ai-agent-queries').add(queryData).catch(err => {
            console.error('Failed to save query to Firestore:', err);
        });

        return NextResponse.json(
            {
                recommendations,
                message,
            },
            { headers }
        );
    } catch (error) {
        console.error('Recommendation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate recommendations';
        return NextResponse.json(
            {
                recommendations: [],
                message: 'Sorry, I encountered an error. Please try again.',
                error: errorMessage
            },
            { status: 500 }
        );
    }
}
