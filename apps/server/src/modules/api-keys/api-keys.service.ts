import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "@nexora/database";
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Injectable()
export class ApiKeysService {
  async create(dto: CreateApiKeyDto, userId: string) {
    const rawKey = `nxa_${uuidv4().replace(/-/g, '')}${crypto.randomBytes(16).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await prisma.apiKey.create({
      data: {
        name: dto.name,
        key: keyHash,
        scopes: [],
        userId,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      key: rawKey,
      createdAt: apiKey.createdAt,
    };
  }

  async findAll(userId: string) {
    return prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        scopes: true,
        lastUsedAt: true,
        expiresAt: true,
        userId: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const key = await prisma.apiKey.findFirst({ where: { id, userId } });
    if (!key) {
      throw new NotFoundException(`API key with id ${id} not found`);
    }
    return key;
  }

  async validate(key: string) {
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');
    const apiKey = await prisma.apiKey.findUnique({ where: { key: keyHash } });
    if (apiKey && (!apiKey.expiresAt || apiKey.expiresAt > new Date())) {
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      });
      return apiKey;
    }
    return null;
  }

  async revoke(id: string, userId: string): Promise<void> {
    const key = await prisma.apiKey.findFirst({ where: { id, userId } });
    if (!key) {
      throw new NotFoundException(`API key with id ${id} not found`);
    }
    await prisma.apiKey.update({
      where: { id },
      data: { expiresAt: new Date() },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const key = await prisma.apiKey.findFirst({ where: { id, userId } });
    if (!key) {
      throw new NotFoundException(`API key with id ${id} not found`);
    }
    await prisma.apiKey.delete({ where: { id } });
  }
}
