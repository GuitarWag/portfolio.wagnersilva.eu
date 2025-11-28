import type { SlideData } from '@/lib/types';
import type { ProfileData, TargetConfig } from '../types';

// Why Stockholm slide (reusable for any Stockholm target)
export function createWhyStockholmSlide(roleType: 'full-stack' | 'data-engineer'): SlideData {
    return {
        id: 'motivation',
        title: 'Why Stockholm?',
        subtitle: "This isn't just a job change - it's a life decision I've already committed to.",
        layout: 'why-stockholm',
        columns: [
            {
                title: 'Career Growth',
                content: [
                    "Deep GCP specialization and engineering in Europe's leading tech ecosystem"
                ]
            },
            {
                title: 'Cultural Fit',
                content: [
                    'Swedish values - pragmatism, honesty, work-life balance - align with how I work'
                ]
            },
            {
                title: 'Long-Term Commitment',
                content: [
                    "I need work permit sponsorship, but this isn't short-term. I'm relocating my life to Stockholm, not just taking a job."
                ]
            }
        ],
        footer: "By sponsoring this move, you're not just filling a role - you're enabling a career transition I've planned deliberately. I'm ready to invest years here."
    };
}

// Generic "Why [Company]?" slide
export function createWhyCompanySlide(companyName: string, reasons: string[]): SlideData {
    return {
        id: 'why-company',
        title: `Why ${companyName}?`,
        layout: 'bullets',
        content: reasons
    };
}

// Logistics slide
export function createLogisticsSlide(profile: ProfileData): SlideData {
    return {
        id: 'logistics',
        title: 'Logistics & Next Steps',
        layout: 'logistics',
        cards: [
            { icon: 'MapPin', value: profile.currentLocation, title: 'Current Location', description: 'Ready to move' },
            { icon: 'FileCheck', value: 'Visa', title: 'Status', description: profile.visaStatus },
            { icon: 'Calendar', value: profile.startDate, title: 'Start Date', description: 'Flexible / Remote start' },
            { icon: 'Mail', value: 'Contact', title: 'Get in Touch', description: `mailto:${profile.email}|${profile.email}||https://${profile.linkedin}|LinkedIn` }
        ]
    };
}

// Closing slide for Full Stack
export function createFullStackClosingSlide(profile: ProfileData): SlideData {
    return {
        id: 'closing',
        title: 'Thank You',
        subtitle: `${profile.name}\nSoftware Engineer | Cloud Architect | Data Engineer`,
        layout: 'title-only',
        content: [],
        footer: [
            `${profile.website} | ${profile.linkedin}`,
            profile.email
        ]
    };
}

// Closing slide for Data Engineer
export function createDataEngineerClosingSlide(profile: ProfileData): SlideData {
    return {
        id: 'closing',
        title: 'Thank You',
        subtitle: 'Ready to bring data engineering excellence to Stockholm',
        layout: 'title-only',
        content: ['Proven Impact'],
        footer: `${profile.name} | GCP Architect & Senior Data Engineer`
    };
}

// Role alignment slide
export function createAlignmentSlide(
    target: TargetConfig
): SlideData {
    return {
        id: 'alignment',
        title: `Perfect Match for ${target.companyName}`,
        layout: 'two-column',
        columns: [
            {
                title: 'Requirements',
                content: target.requirements || [
                    '5+ Years Experience',
                    'Strong GCP Knowledge',
                    'TypeScript/Python',
                    'Real-time Systems',
                    'Security Mindset'
                ]
            },
            {
                title: 'My Experience',
                content: target.myExperience || [
                    '7+ Years Professional Exp.',
                    'Primary Cloud Platform',
                    'Full Stack Proficiency',
                    'Extensive (CDC, Pub/Sub)',
                    'Security-First Approach'
                ]
            }
        ]
    };
}

// What I Bring slide
export function createWhatIBringSlide(companyName: string): SlideData {
    return {
        id: 'what-i-bring',
        title: `What I Bring to ${companyName}`,
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
    };
}

// Core strengths slides
export function createStrengthFullStackSlide(): SlideData {
    return {
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
    };
}

export function createStrengthSecuritySlide(): SlideData {
    return {
        id: 'strength-security',
        title: 'Core Strength: Security-First',
        subtitle: 'Enterprise-Grade Security by Default',
        layout: 'grid-cards',
        cards: [
            { icon: 'Lock', title: 'Zero Incidents', description: 'Across all projects' },
            { icon: 'Shield', title: 'Compliance', description: 'GDPR & Financial Data' },
            { icon: 'Users', title: 'Auth', description: 'JWT, SSO, IAM' },
            { icon: 'Database', title: 'Protection', description: 'Row-level Security' }
        ]
    };
}

export function createStrengthScalabilitySlide(): SlideData {
    return {
        id: 'strength-scale',
        title: 'Core Strength: Scalability',
        subtitle: 'Proven at Global Scale',
        layout: 'grid-cards',
        cards: [
            { icon: 'Users', title: 'Millions', description: 'Users Served' },
            { icon: 'Globe', title: '3 Continents', description: 'Global Operations' },
            { icon: 'Zap', title: 'Sub-second', description: 'Response Times' },
            { icon: 'Server', title: '99.9%+', description: 'High Availability' }
        ]
    };
}

export function createProblemSolvingSlide(): SlideData {
    return {
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
    };
}

// Cost savings impact slide
export function createCostImpactSlide(): SlideData {
    return {
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
    };
}

// Achievements slide
export function createAchievementsSlide(): SlideData {
    return {
        id: 'achievements',
        title: 'Core Strengths & Highlights',
        layout: 'grid-cards',
        cards: [
            { icon: 'Shield', value: 'Zero', title: 'Data Loss', description: 'Financial & sensitive data' },
            { icon: 'Lock', value: 'Security', title: 'First', description: 'RLS, IAP, PII masking' },
            { icon: 'TrendingDown', value: '€15K+', title: 'Cost Savings', description: 'Efficient architectures' },
            { icon: 'Puzzle', value: 'Reusable', title: 'Patterns', description: 'Libraries at scale' },
            { icon: 'GitMerge', value: 'Complex', title: 'Integrations', description: 'Tri-sync, API workarounds' },
            { icon: 'Bot', value: 'AI/ML', title: 'Innovation', description: 'RAG, Vertex AI, LLMs' },
            { icon: 'Globe', value: '100K+', title: 'Global Scale', description: 'Users worldwide' },
            { icon: 'Rocket', value: 'End-to-End', title: 'Ownership', description: 'Interviews to production' }
        ]
    };
}

// Section header generator
export function createSectionHeader(title: string, subtitle: string): SlideData {
    return {
        id: `section-${title.toLowerCase().replace(/\s+/g, '-')}`,
        title,
        subtitle,
        layout: 'section-header'
    };
}
