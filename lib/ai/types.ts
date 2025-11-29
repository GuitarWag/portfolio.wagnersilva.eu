// Types for AI TL;DR feature

export interface TLDRRequest {
    projectTitle: string;
    projectSubtitle: string;
    context?: string[];
    challenge: string[];
    solution: string[];
    impact: string[];
    techs: string[];
    videoTranscript?: string;
}

export interface TLDRResponse {
    summary: string;
    error?: string;
}
