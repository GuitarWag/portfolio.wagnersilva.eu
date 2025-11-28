import type { SlideData, PresentationData } from '@/lib/types';
import type { ProfileData, TargetConfig, ProjectData } from './types';
import { projectToSlide } from './types';
import { projectsRegistry, getProjectsById } from './projects';
import {
    defaultProfile,
    createFullStackTitleSlide,
    createDataEngineerTitleSlide,
    createFullStackGlanceSlide,
    createDataEngineerGlanceSlide,
    createFullStackTechSlide,
    createDataEngineerTechSlide,
    createFullStackCapabilitiesSlide,
    createGCPExpertiseSlide,
    createRealTimeExperienceSlide,
    createGrowthAreasSlide,
    createSkillsSlide,
    createWhyStockholmSlide,
    createWhyCompanySlide,
    createLogisticsSlide,
    createFullStackClosingSlide,
    createDataEngineerClosingSlide,
    createAlignmentSlide,
    createWhatIBringSlide,
    createStrengthFullStackSlide,
    createStrengthSecuritySlide,
    createStrengthScalabilitySlide,
    createProblemSolvingSlide,
    createCostImpactSlide,
    createAchievementsSlide,
    createSectionHeader,
} from './slides';

// Section definition for grouping projects
interface SectionDefinition {
    title: string;
    subtitle: string;
    projectIds: string[];
}

// Full presentation configuration
export interface PresentationBuildConfig {
    id: string;
    roleType: 'full-stack' | 'data-engineer';
    profile?: ProfileData;
    target: TargetConfig;
    // Project selection
    projectIds?: string[]; // If not using sections
    sections?: SectionDefinition[]; // Groups projects with headers
    // Optional slide inclusions
    includeWhyCompany?: boolean;
    whyCompanyReasons?: string[];
    includeGrowthAreas?: boolean;
    growthAreas?: string[];
    includeSkills?: boolean;
    hardSkills?: string[];
    softSkills?: string[];
    includeTechStack?: boolean;
    includeCapabilities?: boolean;
    includeGCPExpertise?: boolean;
    includeRealTimeExperience?: boolean;
    includeStrengths?: boolean;
    includeCostImpact?: boolean;
    includeAchievements?: boolean;
    includeWhyStockholm?: boolean;
    // Global video URL for all slides (can be overridden per slide if needed)
    videoUrl?: string;
}

// Build a complete presentation from config
export function buildPresentation(config: PresentationBuildConfig): PresentationData {
    const profile = config.profile || defaultProfile;
    const slides: SlideData[] = [];

    // 1. Title slide
    if (config.roleType === 'full-stack') {
        slides.push(createFullStackTitleSlide(profile, config.target.companyName));
    } else {
        slides.push(createDataEngineerTitleSlide(profile, config.target.companyName));
    }

    // 2. At a Glance
    if (config.roleType === 'full-stack') {
        slides.push(createFullStackGlanceSlide(profile));
    } else {
        slides.push(createDataEngineerGlanceSlide(profile));
    }

    // 2.5 Skills (optional)
    if (config.includeSkills && config.hardSkills && config.softSkills) {
        slides.push(createSkillsSlide(config.hardSkills, config.softSkills));
    }

    // 3. Why Company (optional)
    if (config.includeWhyCompany && config.whyCompanyReasons) {
        slides.push(createWhyCompanySlide(config.target.companyName, config.whyCompanyReasons));
    }

    // 4. Tech Stack (optional)
    if (config.includeTechStack) {
        if (config.roleType === 'full-stack') {
            slides.push(createFullStackTechSlide());
        } else {
            slides.push(createDataEngineerTechSlide());
        }
    }

    // 5. Capabilities (optional, full-stack only)
    if (config.includeCapabilities && config.roleType === 'full-stack') {
        slides.push(createFullStackCapabilitiesSlide());
    }

    // 6. GCP Expertise (optional)
    if (config.includeGCPExpertise) {
        slides.push(createGCPExpertiseSlide());
    }

    // 7. Real-time Experience (optional)
    if (config.includeRealTimeExperience) {
        slides.push(createRealTimeExperienceSlide());
    }

    // 8. Growth Areas (optional)
    if (config.includeGrowthAreas && config.growthAreas) {
        slides.push(createGrowthAreasSlide(config.growthAreas));
    }

    // 9. Projects - either sectioned or flat
    let projectIndex = 1;
    if (config.sections) {
        for (const section of config.sections) {
            // Add section header
            slides.push(createSectionHeader(section.title, section.subtitle));
            // Add projects in section
            const projects = getProjectsById(section.projectIds);
            for (const project of projects) {
                slides.push(projectToSlide(project, projectIndex++));
            }
        }
    } else if (config.projectIds) {
        // Flat list of projects
        const projects = getProjectsById(config.projectIds);
        for (const project of projects) {
            slides.push(projectToSlide(project, projectIndex++));
        }
    }

    // 10. Cost Impact (optional)
    if (config.includeCostImpact) {
        slides.push(createCostImpactSlide());
    }

    // 11. Achievements (optional)
    if (config.includeAchievements) {
        slides.push(createAchievementsSlide());
    }

    // 12. Strengths (optional)
    if (config.includeStrengths) {
        if (config.roleType === 'full-stack') {
            slides.push(createStrengthFullStackSlide());
        }
        slides.push(createStrengthSecuritySlide());
        slides.push(createStrengthScalabilitySlide());
        slides.push(createProblemSolvingSlide());
    }

    // 13. Alignment slide
    slides.push(createAlignmentSlide(config.target));

    // 14. What I Bring
    slides.push(createWhatIBringSlide(config.target.companyName));

    // 15. Why Stockholm (optional)
    if (config.includeWhyStockholm) {
        slides.push(createWhyStockholmSlide(config.roleType));
    }

    // 16. Logistics
    slides.push(createLogisticsSlide(profile));

    // 17. Closing
    if (config.roleType === 'full-stack') {
        slides.push(createFullStackClosingSlide(profile));
    } else {
        slides.push(createDataEngineerClosingSlide(profile));
    }

    // Apply global video URL if present and not already set on slide
    if (config.videoUrl) {
        slides.forEach(slide => {
            if (!slide.videoUrl) {
                slide.videoUrl = config.videoUrl;
            }
        });
    }

    return {
        id: config.id,
        title: config.roleType === 'full-stack'
            ? `Full Stack Web Developer - ${config.target.companyName}`
            : `Data Engineer Portfolio - ${config.target.companyName}`,
        slides
    };
}

// Quick builder for common scenarios
export function buildQuickPresentation(
    roleType: 'full-stack' | 'data-engineer',
    companyName: string,
    projectIds: string[],
    options?: Partial<PresentationBuildConfig>
): PresentationData {
    return buildPresentation({
        id: `portfolio-${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        roleType,
        target: {
            companyName,
            roleName: roleType === 'full-stack' ? 'Full Stack Developer' : 'Data Engineer',
            roleType,
        },
        projectIds,
        includeTechStack: true,
        includeWhyStockholm: true,
        ...options
    });
}
