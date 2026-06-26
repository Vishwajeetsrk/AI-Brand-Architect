import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from "@nexora/database";
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  async create(dto: CreateBrandDto, userId: string) {
    return prisma.brand.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        industry: dto.industry ?? null,
        userId,
      },
    });
  }

  async findAll(userId?: string, search?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    return prisma.brand.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    return brand;
  }

  async update(id: string, dto: UpdateBrandDto) {
    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.industry !== undefined) data.industry = dto.industry;

    return prisma.brand.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    await prisma.brand.delete({ where: { id } });
  }
}
