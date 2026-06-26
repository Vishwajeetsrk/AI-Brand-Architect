import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from "@nexora/database";
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  async create(dto: CreateProjectDto, userId: string) {
    return prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        brandId: dto.brandId,
        userId,
        status: 'ACTIVE' as any,
      },
    });
  }

  async findAll(userId?: string, brandId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (brandId) where.brandId = brandId;
    return prisma.project.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.brandId !== undefined) data.brandId = dto.brandId;
    if (dto.status !== undefined) data.status = dto.status.toUpperCase();

    return prisma.project.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    await prisma.project.delete({ where: { id } });
  }
}
