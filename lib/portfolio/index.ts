// Main portfolio module exports

// Types
export type {
    ProjectData,
    ProfileData,
    TargetConfig,
    ProjectCategory,
    TechTag,
    PresentationConfig
} from './types';
export { projectToSlide } from './types';

// Projects
export {
    projectsRegistry,
    allProjects,
    getProjectsByCategory,
    getProjectsByTag,
    getProjectsById,
    // Individual projects
    pageBuilder,
    ragSystem,
    triDirectionalSync,
    costOptimization,
    rlsSecurity,
    sftpArchitecture,
    apiIntegration,
    cicdPipeline,
    apisixGateway,
    cdcPipeline,
    dbAnonymization,
    sharepointLeadership,
} from './projects';

// Slides
export {
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

// Composer
export { buildPresentation, buildQuickPresentation } from './composer';
export type { PresentationBuildConfig } from './composer';

// Pre-built presentations
export {
    bambuserFullStack,
    dataEngineerGeneric,
    presentationsRegistry,
    getPresentation,
    listPresentations,
} from './presentations';
