import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

export interface ApiKey {
  id: string;
  name: string;
  keyHash: string;
  keyPrefix: string;
  userId: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
}

@Injectable()
export class ApiKeysService {
  private apiKeys: ApiKey[] = [];

  create(dto: CreateApiKeyDto, userId: string): { id: string; name: string; key: string; createdAt: Date } {
    const rawKey = `nxa_${uuidv4().replace(/-/g, '')}${crypto.randomBytes(16).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 12);

    const apiKey: ApiKey = {
      id: uuidv4(),
      name: dto.name,
      keyHash,
      keyPrefix,
      userId,
      description: dto.description || null,
      isActive: true,
      createdAt: new Date(),
      lastUsedAt: null,
    };

    this.apiKeys.push(apiKey);

    return {
      id: apiKey.id,
      name: apiKey.name,
      key: rawKey,
      createdAt: apiKey.createdAt,
    };
  }

  findAll(userId: string): Omit<ApiKey, 'keyHash'>[] {
    return this.apiKeys
      .filter((k) => k.userId === userId)
      .map(({ keyHash, ...rest }) => rest);
  }

  findOne(id: string, userId: string): ApiKey {
    const key = this.apiKeys.find((k) => k.id === id && k.userId === userId);
    if (!key) {
      throw new NotFoundException(`API key with id ${id} not found`);
    }
    return key;
  }

  validate(key: string): ApiKey | null {
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');
    const apiKey = this.apiKeys.find((k) => k.keyHash === keyHash && k.isActive);
    if (apiKey) {
      apiKey.lastUsedAt = new Date();
    }
    return apiKey || null;
  }

  revoke(id: string, userId: string): void {
    const key = this.findOne(id, userId);
    key.isActive = false;
  }

  remove(id: string, userId: string): void {
    const index = this.apiKeys.findIndex((k) => k.id === id && k.userId === userId);
    if (index === -1) {
      throw new NotFoundException(`API key with id ${id} not found`);
    }
    this.apiKeys.splice(index, 1);
  }
}
