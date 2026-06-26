import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  brandId: string;
  userId: string;
  tags: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProjectsService {
  private projects: Project[] = [];

  create(dto: CreateProjectDto, userId: string): Project {
    const project: Project = {
      id: uuidv4(),
      name: dto.name,
      description: dto.description || null,
      brandId: dto.brandId,
      userId,
      tags: dto.tags || [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.push(project);
    return project;
  }

  findAll(userId?: string, brandId?: string): Project[] {
    let result = this.projects;
    if (userId) {
      result = result.filter((p) => p.userId === userId);
    }
    if (brandId) {
      result = result.filter((p) => p.brandId === brandId);
    }
    return result;
  }

  findOne(id: string): Project {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  update(id: string, dto: UpdateProjectDto): Project {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    const updated: Project = {
      ...this.projects[index],
      updatedAt: new Date(),
    };

    if (dto.name !== undefined) updated.name = dto.name;
    if (dto.description !== undefined) updated.description = dto.description;
    if (dto.brandId !== undefined) updated.brandId = dto.brandId;
    if (dto.tags !== undefined) updated.tags = dto.tags;
    if (dto.status !== undefined) updated.status = dto.status;

    this.projects[index] = updated;
    return updated;
  }

  remove(id: string): void {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    this.projects.splice(index, 1);
  }
}
