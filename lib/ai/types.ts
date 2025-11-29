// Types for AI TL;DR feature

export type AudienceLevel = 'non-technical' | 'technical';

export interface TLDRRequest {
    projectTitle: string;
    projectSubtitle: string;
    context?: string[];
    challenge: string[];
    solution: string[];
    impact: string[];
    techs: string[];
    videoTranscript?: string;
    audienceLevel?: AudienceLevel;
}

export interface TLDRResponse {
    summary: string;
    error?: string;
}
