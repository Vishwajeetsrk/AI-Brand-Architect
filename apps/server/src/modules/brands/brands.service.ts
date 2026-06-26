import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

export interface Brand {
  id: string;
  name: string;
  description: string | null;
  primaryColor: string | null;
  industry: string | null;
  keywords: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class BrandsService {
  private brands: Brand[] = [];

  create(dto: CreateBrandDto, userId: string): Brand {
    const brand: Brand = {
      id: uuidv4(),
      name: dto.name,
      description: dto.description || null,
      primaryColor: dto.primaryColor || null,
      industry: dto.industry || null,
      keywords: dto.keywords || [],
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.brands.push(brand);
    return brand;
  }

  findAll(userId?: string, search?: string): Brand[] {
    let result = this.brands;
    if (userId) {
      result = result.filter((b) => b.userId === userId);
    }
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(lower) ||
          (b.description && b.description.toLowerCase().includes(lower)),
      );
    }
    return result;
  }

  findOne(id: string): Brand {
    const brand = this.brands.find((b) => b.id === id);
    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    return brand;
  }

  update(id: string, dto: UpdateBrandDto): Brand {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    const updated: Brand = {
      ...this.brands[index],
      updatedAt: new Date(),
    };

    if (dto.name !== undefined) updated.name = dto.name;
    if (dto.description !== undefined) updated.description = dto.description;
    if (dto.primaryColor !== undefined) updated.primaryColor = dto.primaryColor;
    if (dto.industry !== undefined) updated.industry = dto.industry;
    if (dto.keywords !== undefined) updated.keywords = dto.keywords;

    this.brands[index] = updated;
    return updated;
  }

  remove(id: string): void {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    this.brands.splice(index, 1);
  }
}
