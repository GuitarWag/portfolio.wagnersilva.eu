// All portfolio projects - single source of truth
export { pageBuilder } from './page-builder';
export { ragSystem } from './rag-system';
export { triDirectionalSync } from './tri-directional-sync';
export { costOptimization } from './cost-optimization';
export { rlsSecurity } from './rls-security';
export { sftpArchitecture } from './sftp-architecture';
export { apiIntegration } from './api-integration';
export { cicdPipeline } from './cicd-pipeline';
export { apisixGateway } from './apisix-gateway';
export { cdcPipeline } from './cdc-pipeline';
export { dbAnonymization } from './db-anonymization';
export { sharepointLeadership } from './sharepoint-leadership';
export { portfolioSystem } from './portfolio-system';

import type { ProjectData } from '../types';
import { pageBuilder } from './page-builder';
import { ragSystem } from './rag-system';
import { triDirectionalSync } from './tri-directional-sync';
import { costOptimization } from './cost-optimization';
import { rlsSecurity } from './rls-security';
import { sftpArchitecture } from './sftp-architecture';
import { apiIntegration } from './api-integration';
import { cicdPipeline } from './cicd-pipeline';
import { apisixGateway } from './apisix-gateway';
import { cdcPipeline } from './cdc-pipeline';
import { dbAnonymization } from './db-anonymization';
import { sharepointLeadership } from './sharepoint-leadership';
import { portfolioSystem } from './portfolio-system';

// Registry of all projects by ID
export const projectsRegistry: Record<string, ProjectData> = {
    'page-builder': pageBuilder,
    'rag-system': ragSystem,
    'tri-directional-sync': triDirectionalSync,
    'cost-optimization': costOptimization,
    'rls-security': rlsSecurity,
    'sftp-architecture': sftpArchitecture,
    'api-integration': apiIntegration,
    'cicd-pipeline': cicdPipeline,
    'apisix-gateway': apisixGateway,
    'cdc-pipeline': cdcPipeline,
    'db-anonymization': dbAnonymization,
    'sharepoint-leadership': sharepointLeadership,
    'portfolio-system': portfolioSystem,
};

// All projects as array for iteration
export const allProjects: ProjectData[] = Object.values(projectsRegistry);

// Get projects by category
export function getProjectsByCategory(category: ProjectData['category']): ProjectData[] {
    return allProjects.filter(p => p.category === category);
}

// Get projects by tag
export function getProjectsByTag(tag: string): ProjectData[] {
    return allProjects.filter(p => p.tags.includes(tag));
}

// Get multiple projects by IDs
export function getProjectsById(ids: string[]): ProjectData[] {
    return ids.map(id => projectsRegistry[id]).filter(Boolean);
}
