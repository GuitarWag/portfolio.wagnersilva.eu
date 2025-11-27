// Pre-built presentations
export { bambuserFullStack } from './bambuser-fullstack';
export { dataEngineerGeneric } from './data-engineer-generic';

// Composer for custom presentations
export { buildPresentation, buildQuickPresentation } from '../composer';
export type { PresentationBuildConfig } from '../composer';

// Re-export projects registry for reference
export { projectsRegistry, allProjects, getProjectsByCategory, getProjectsByTag, getProjectsById } from '../projects';

// Re-export types
export type { ProjectData, ProfileData, TargetConfig, ProjectCategory } from '../types';

import type { PresentationData } from '@/lib/types';
import { bambuserFullStack } from './bambuser-fullstack';
import { dataEngineerGeneric } from './data-engineer-generic';

// Registry of all pre-built presentations
export const presentationsRegistry: Record<string, PresentationData> = {
    'bambuser-fullstack': bambuserFullStack,
    'data-engineer-generic': dataEngineerGeneric,
};

// Get presentation by ID
export function getPresentation(id: string): PresentationData | undefined {
    return presentationsRegistry[id];
}

// List all available presentation IDs
export function listPresentations(): string[] {
    return Object.keys(presentationsRegistry);
}
