import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from "@nexora/database";
import { CreateAssetDto } from './dto/create-asset.dto';

@Injectable()
export class AssetsService {
  async create(dto: CreateAssetDto, userId: string) {
    return prisma.asset.create({
      data: {
        name: dto.fileName,
        type: (dto.assetType?.toUpperCase() ?? 'OTHER') as any,
        url: dto.url ?? '',
        size: dto.fileSize,
        mimeType: dto.mimeType,
        projectId: dto.projectId ?? null,
        userId,
      },
    });
  }

  async findAll(userId?: string, projectId?: string, brandId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;
    return prisma.asset.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
    return asset;
  }

  async remove(id: string): Promise<void> {
    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
    await prisma.asset.delete({ where: { id } });
  }
}
