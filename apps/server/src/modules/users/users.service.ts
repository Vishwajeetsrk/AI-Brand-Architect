import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = this.users.find((u) => u.email === dto.email);
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user: User = {
      id: uuidv4(),
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(({ password, ...rest }) => rest);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updated: User = { ...this.users[index], updatedAt: new Date() };

    if (dto.email) updated.email = dto.email;
    if (dto.firstName) updated.firstName = dto.firstName;
    if (dto.lastName) updated.lastName = dto.lastName;
    if (dto.role) updated.role = dto.role;
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      updated.password = await bcrypt.hash(dto.password, salt);
    }

    this.users[index] = updated;
    const { password, ...result } = updated;
    return result;
  }

  async remove(id: string): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
