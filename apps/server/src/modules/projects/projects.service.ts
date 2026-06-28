import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  userId: string;
  organizationId?: string;
  brandId?: string;
  settings: {
    visibility: 'private' | 'team' | 'public';
    allowComments: boolean;
    allowCollaborators: boolean;
  };
  metadata: {
    tags: string[];
    priority: 'low' | 'medium' | 'high';
    deadline?: Date;
    estimatedHours?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectAsset {
  id: string;
  projectId: string;
  type: 'logo' | 'website' | 'ui' | 'document' | 'image' | 'code';
  name: string;
  url: string;
  thumbnail?: string;
  metadata: any;
  createdAt: Date;
}

export interface ProjectCollaborator {
  id: string;
  projectId: string;
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
    canExport: boolean;
  };
  joinedAt: Date;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  brandId?: string;
  visibility?: 'private' | 'team' | 'public';
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  deadline?: Date;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: 'draft' | 'active' | 'completed' | 'archived';
  brandId?: string;
  settings?: {
    visibility?: 'private' | 'team' | 'public';
    allowComments?: boolean;
    allowCollaborators?: boolean;
  };
  metadata?: {
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
    deadline?: Date;
    estimatedHours?: number;
  };
}

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  private projects: Map<string, Project> = new Map();
  private assets: Map<string, ProjectAsset[]> = new Map();
  private collaborators: Map<string, ProjectCollaborator[]> = new Map();

  constructor() {}

  async createProject(userId: string, createProjectDto: CreateProjectDto): Promise<Project> {
    this.logger.log(`Creating project for user: ${userId}`);

    const project: Project = {
      id: Date.now().toString(),
      name: createProjectDto.name,
      description: createProjectDto.description,
      status: 'draft',
      userId,
      organizationId: undefined,
      brandId: createProjectDto.brandId,
      settings: {
        visibility: createProjectDto.visibility || 'private',
        allowComments: true,
        allowCollaborators: true,
      },
      metadata: {
        tags: createProjectDto.tags || [],
        priority: createProjectDto.priority || 'medium',
        deadline: createProjectDto.deadline,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projects.set(project.id, project);
    this.assets.set(project.id, []);
    this.collaborators.set(project.id, []);

    this.logger.log(`Project created: ${project.id}`);

    return project;
  }

  async getProjects(userId: string, organizationId?: string): Promise<Project[]> {
    this.logger.log(`Getting projects for user: ${userId}`);
    
    const projects = Array.from(this.projects.values()).filter(p => p.userId === userId);
    
    if (organizationId) {
      return projects.filter(p => p.organizationId === organizationId);
    }

    return projects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getProject(userId: string, projectId: string): Promise<Project> {
    this.logger.log(`Getting project: ${projectId}`);
    
    const project = this.projects.get(projectId);
    
    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async updateProject(userId: string, projectId: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    this.logger.log(`Updating project: ${projectId}`);
    
    const project = await this.getProject(userId, projectId);
    
    if (updateProjectDto.name) project.name = updateProjectDto.name;
    if (updateProjectDto.description) project.description = updateProjectDto.description;
    if (updateProjectDto.status) project.status = updateProjectDto.status;
    if (updateProjectDto.brandId) project.brandId = updateProjectDto.brandId;
    if (updateProjectDto.settings) project.settings = { ...project.settings, ...updateProjectDto.settings };
    if (updateProjectDto.metadata) project.metadata = { ...project.metadata, ...updateProjectDto.metadata };
    
    project.updatedAt = new Date();
    
    this.projects.set(projectId, project);
    return project;
  }

  async deleteProject(userId: string, projectId: string): Promise<void> {
    this.logger.log(`Deleting project: ${projectId}`);
    
    const project = await this.getProject(userId, projectId);
    
    this.projects.delete(projectId);
    this.assets.delete(projectId);
    this.collaborators.delete(projectId);
  }

  async getProjectAssets(userId: string, projectId: string): Promise<ProjectAsset[]> {
    this.logger.log(`Getting assets for project: ${projectId}`);
    
    await this.getProject(userId, projectId); // Verify access
    
    return this.assets.get(projectId) || [];
  }

  async addProjectAsset(userId: string, projectId: string, asset: Omit<ProjectAsset, 'id' | 'projectId' | 'createdAt'>): Promise<ProjectAsset> {
    this.logger.log(`Adding asset to project: ${projectId}`);
    
    await this.getProject(userId, projectId); // Verify access
    
    const newAsset: ProjectAsset = {
      ...asset,
      id: Date.now().toString(),
      projectId,
      createdAt: new Date(),
    };

    const projectAssets = this.assets.get(projectId) || [];
    projectAssets.push(newAsset);
    this.assets.set(projectId, projectAssets);

    return newAsset;
  }

  async deleteProjectAsset(userId: string, projectId: string, assetId: string): Promise<void> {
    this.logger.log(`Deleting asset: ${assetId}`);
    
    await this.getProject(userId, projectId); // Verify access
    
    const projectAssets = this.assets.get(projectId) || [];
    const filteredAssets = projectAssets.filter(a => a.id !== assetId);
    this.assets.set(projectId, filteredAssets);
  }

  async getProjectCollaborators(userId: string, projectId: string): Promise<ProjectCollaborator[]> {
    this.logger.log(`Getting collaborators for project: ${projectId}`);
    
    await this.getProject(userId, projectId); // Verify access
    
    return this.collaborators.get(projectId) || [];
  }

  async addProjectCollaborator(
    userId: string,
    projectId: string,
    email: string,
    name: string,
    role: 'owner' | 'admin' | 'editor' | 'viewer' = 'viewer'
  ): Promise<ProjectCollaborator> {
    this.logger.log(`Adding collaborator to project: ${projectId}`);
    
    const project = await this.getProject(userId, projectId); // Verify access
    
    const permissions = {
      canEdit: role === 'owner' || role === 'admin' || role === 'editor',
      canDelete: role === 'owner' || role === 'admin',
      canInvite: role === 'owner' || role === 'admin',
      canExport: role !== 'viewer',
    };

    const collaborator: ProjectCollaborator = {
      id: Date.now().toString(),
      projectId,
      userId: Date.now().toString(), // Mock user ID
      email,
      name,
      role,
      permissions,
      joinedAt: new Date(),
    };

    const projectCollaborators = this.collaborators.get(projectId) || [];
    projectCollaborators.push(collaborator);
    this.collaborators.set(projectId, projectCollaborators);

    return collaborator;
  }

  async removeProjectCollaborator(userId: string, projectId: string, collaboratorId: string): Promise<void> {
    this.logger.log(`Removing collaborator: ${collaboratorId}`);
    
    await this.getProject(userId, projectId); // Verify access
    
    const projectCollaborators = this.collaborators.get(projectId) || [];
    const filteredCollaborators = projectCollaborators.filter(c => c.id !== collaboratorId);
    this.collaborators.set(projectId, filteredCollaborators);
  }

  async updateCollaboratorRole(
    userId: string,
    projectId: string,
    collaboratorId: string,
    newRole: 'owner' | 'admin' | 'editor' | 'viewer'
  ): Promise<ProjectCollaborator> {
    this.logger.log(`Updating collaborator role: ${collaboratorId}`);
    
    await this.getProject(userId, projectId); // Verify access
    
    const projectCollaborators = this.collaborators.get(projectId) || [];
    const collaborator = projectCollaborators.find(c => c.id === collaboratorId);
    
    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    collaborator.role = newRole;
    collaborator.permissions = {
      canEdit: newRole === 'owner' || newRole === 'admin' || newRole === 'editor',
      canDelete: newRole === 'owner' || newRole === 'admin',
      canInvite: newRole === 'owner' || newRole === 'admin',
      canExport: newRole !== 'viewer',
    };

    this.collaborators.set(projectId, projectCollaborators);
    return collaborator;
  }

  async duplicateProject(userId: string, projectId: string): Promise<Project> {
    this.logger.log(`Duplicating project: ${projectId}`);
    
    const originalProject = await this.getProject(userId, projectId);
    
    const newProject: Project = {
      ...originalProject,
      id: Date.now().toString(),
      name: `${originalProject.name} (Copy)`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projects.set(newProject.id, newProject);
    
    // Copy assets
    const originalAssets = this.assets.get(projectId) || [];
    this.assets.set(newProject.id, [...originalAssets]);
    
    // Don't copy collaborators
    this.collaborators.set(newProject.id, []);

    return newProject;
  }

  async archiveProject(userId: string, projectId: string): Promise<Project> {
    this.logger.log(`Archiving project: ${projectId}`);
    
    const project = await this.getProject(userId, projectId);
    project.status = 'archived';
    project.updatedAt = new Date();
    
    this.projects.set(projectId, project);
    return project;
  }

  async restoreProject(userId: string, projectId: string): Promise<Project> {
    this.logger.log(`Restoring project: ${projectId}`);
    
    const project = this.projects.get(projectId);
    
    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    project.status = 'active';
    project.updatedAt = new Date();
    
    this.projects.set(projectId, project);
    return project;
  }

  async getProjectStats(userId: string, projectId: string): Promise<any> {
    this.logger.log(`Getting stats for project: ${projectId}`);
    
    const project = await this.getProject(userId, projectId);
    const assets = this.assets.get(projectId) || [];
    const collaborators = this.collaborators.get(projectId) || [];

    return {
      projectId,
      projectName: project.name,
      stats: {
        totalAssets: assets.length,
        assetsByType: {
          logo: assets.filter(a => a.type === 'logo').length,
          website: assets.filter(a => a.type === 'website').length,
          ui: assets.filter(a => a.type === 'ui').length,
          document: assets.filter(a => a.type === 'document').length,
          image: assets.filter(a => a.type === 'image').length,
          code: assets.filter(a => a.type === 'code').length,
        },
        totalCollaborators: collaborators.length,
        collaboratorsByRole: {
          owner: collaborators.filter(c => c.role === 'owner').length,
          admin: collaborators.filter(c => c.role === 'admin').length,
          editor: collaborators.filter(c => c.role === 'editor').length,
          viewer: collaborators.filter(c => c.role === 'viewer').length,
        },
        daysSinceCreation: Math.floor((Date.now() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
        lastUpdated: project.updatedAt,
      },
    };
  }

  async searchProjects(userId: string, query: string): Promise<Project[]> {
    this.logger.log(`Searching projects: ${query}`);
    
    const queryLower = query.toLowerCase();
    
    return Array.from(this.projects.values())
      .filter(p => 
        p.userId === userId &&
        (p.name.toLowerCase().includes(queryLower) || 
         p.description?.toLowerCase().includes(queryLower) ||
         p.metadata.tags.some(tag => tag.toLowerCase().includes(queryLower)))
      )
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}