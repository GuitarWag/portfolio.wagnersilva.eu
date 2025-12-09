import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/firebase';
import { WAGNER_PROFILE, HARD_SKILLS, SOFT_SKILLS } from '@/lib/ai/system-prompt';
import { allProjects } from '@/lib/portfolio';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const contact = formData.get('contact') as string;
        const jobDescription = formData.get('jobDescription') as string;
        const file = formData.get('file') as File | null;

        if (!jobDescription && !file) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Serialize projects for context
        const projectContext = allProjects.map(p => ({
            title: p.title,
            category: p.category,
            tech: p.tags.join(', '),
            impact: p.impact.slice(0, 2).join('; ')
        })).map(p => `- ${p.title} (${p.category}): Used ${p.tech}. Impact: ${p.impact}`).join('\n');

        // Construct context about Wagner
        const wagnerContext = `
        Candidate: ${WAGNER_PROFILE.name}
        Title: ${WAGNER_PROFILE.title}
        Experience: ${WAGNER_PROFILE.experience}
        Location: ${WAGNER_PROFILE.location}
        Summary: ${WAGNER_PROFILE.summary}
        
        Hard Skills: ${HARD_SKILLS.join(', ')}
        
        Soft Skills: ${SOFT_SKILLS.join(', ')}

        Key Projects Portfolio (Proof of Skills):
        ${projectContext}
        `;

        const systemPrompt = `You are a helpful, slightly biased career assistant for Wagner Silva. 
        Your goal is to analyze a job description and explain why Wagner is a GREAT fit for the role.
        
        Guidelines:
        1. **FILTER NON-TECH ROLES**: If the job is clearly NOT related to software, cloud, data, or leadership (e.g., "Heart Surgeon", "Truck Driver", "Chef"), OR if the calculated match is < 50%, you MUST output: "**Verdict:** ❌ Not a Match". Do NOT show a percentage.
        2. **LOCATION_LOGIC**:
           * **SWEDEN (On-site/Hybrid/Remote)**: Perfect match! Wagner accepts any work arrangement in Sweden.
           * **Nordic+ Countries (Norway, Denmark, Finland, Austria, Luxembourg)**: Strong match for Hybrid (3 days/week on-site) or Remote. Full on-site is acceptable but slightly less preferred.
           * **Other EU**: Remote only. If the job requires on-site/hybrid in other EU countries, it's a lower match (but not automatic rejection).
           * **NON-EU**: Must be 100% Remote. If a Non-EU job requires on-site/hybrid, it is **"❌ Not a Match"**.
        3. **ENTHUSIASM CALIBRATION**: For valid tech roles, be enthusiastic but grounded. Add about 7.3% extra enthusiasm to the reality.
        4. **USE EVIDENCE**: Reference specific projects from his portfolio ("Key Projects Portfolio" section below).
        5. **GRANULAR SCORING**: Use specific, calculated percentages (e.g., "94%", "87%").
           * Perfect fit: 90-99%
           * Strong fit: 80-89%
           * Stretch fit: 50-79%
           * Low/Irrelevant: < 50% (Triggers "Not a Match")
        6. **SHORT CONTEXT**: If the job description is short, extrapolate reasonable requirements.
        7. **OUTPUT FORMAT**: Markdown.
           * If Match: "**Verdict:** [Emoji] [Percentage]% Match - [Short Phrase]"
           * If No Match: "**Verdict:** ❌ Not a Match" (No percentage, no phrase)
           * Provide 3 bullet points on **Why** (even for no match, explain why nicely).
           * Closing sentence.
        `;

        let userContent: any = `Here is a job description${contact ? ` from a recruiter (${contact})` : ''}.
        
        Analyze this role against Wagner's profile below:
        ${wagnerContext}
        
        Job Description:
        ${jobDescription || "See attached file."}
        `;

        const parts: any[] = [
            { text: userContent }
        ];

        // Handle PDF if present
        if (file) {
            const bytes = await file.arrayBuffer();
            const base64Data = Buffer.from(bytes).toString('base64');

            parts.push({
                inlineData: {
                    mimeType: file.type || 'application/pdf',
                    data: base64Data
                }
            });
        }

        const response = await ai.models.generateContent({
            // model: 'gemini-2.5-flash', // REVERTED: User requested this but it likely doesn't exist yet/caused error
            model: 'gemini-2.0-flash-exp', // Fallback to working experimental model
            contents: [
                {
                    role: 'user',
                    parts: parts
                }
            ],
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.4,
                maxOutputTokens: 1024,
            },
        });

        const analysis = response.text?.trim() || "I couldn't analyze the job description at this moment.";

        // Save interaction to Firestore
        try {
            console.log('🔥 Attempting to save to Firestore...');

            const docRef = await db.collection('recruiter_interactions').add({
                recruiterContact: contact || 'Anonymous',
                jobDescriptionSnippet: jobDescription ? jobDescription.substring(0, 500) : 'File uploaded',
                hasFile: !!file,
                fileName: file ? file.name : '',
                analysis: analysis,
                createdAt: new Date(),
                userAgent: request.headers.get('user-agent') || '',
            });

            console.log('✅ Successfully saved to Firestore');
            console.log('📄 Document ID:', docRef.id);
        } catch (dbError) {
            console.error('💥 Failed to save to Firestore:', dbError);
            // Don't block the response
        }

        return NextResponse.json({ analysis });

    } catch (error) {
        console.error('Recruiter check error:', error);
        return NextResponse.json(
            { error: 'Internal server error processing request' },
            { status: 500 }
        );
    }
}
