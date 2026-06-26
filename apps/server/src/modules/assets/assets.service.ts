import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAssetDto, AssetType } from './dto/create-asset.dto';

export interface Asset {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  url: string | null;
  assetType: AssetType;
  projectId: string | null;
  brandId: string | null;
  userId: string;
  createdAt: Date;
}

@Injectable()
export class AssetsService {
  private assets: Asset[] = [];

  create(dto: CreateAssetDto, userId: string): Asset {
    const asset: Asset = {
      id: uuidv4(),
      fileName: dto.fileName,
      mimeType: dto.mimeType,
      fileSize: dto.fileSize,
      url: dto.url || null,
      assetType: dto.assetType || AssetType.OTHER,
      projectId: dto.projectId || null,
      brandId: dto.brandId || null,
      userId,
      createdAt: new Date(),
    };
    this.assets.push(asset);
    return asset;
  }

  findAll(userId?: string, projectId?: string, brandId?: string): Asset[] {
    let result = this.assets;
    if (userId) result = result.filter((a) => a.userId === userId);
    if (projectId) result = result.filter((a) => a.projectId === projectId);
    if (brandId) result = result.filter((a) => a.brandId === brandId);
    return result;
  }

  findOne(id: string): Asset {
    const asset = this.assets.find((a) => a.id === id);
    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
    return asset;
  }

  remove(id: string): void {
    const index = this.assets.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
    this.assets.splice(index, 1);
  }
}
