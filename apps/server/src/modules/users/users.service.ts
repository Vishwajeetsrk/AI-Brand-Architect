import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { prisma } from "@nexora/database";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  async create(dto: CreateUserDto) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    return prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        name: `${dto.firstName} ${dto.lastName}`,
        role: dto.role ? (dto.role.toUpperCase() as any) : 'USER',
      },
    });
  }

  async findAll() {
    return prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const data: any = {};
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.role !== undefined) data.role = dto.role.toUpperCase();
    if (dto.firstName !== undefined || dto.lastName !== undefined) {
      const parts = existing.name.split(' ');
      data.name = `${dto.firstName ?? parts[0]} ${dto.lastName ?? parts.slice(1).join(' ')}`.trim();
    }
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      data.passwordHash = await bcrypt.hash(dto.password, salt);
    }

    return prisma.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await prisma.user.delete({ where: { id } });
  }
}
