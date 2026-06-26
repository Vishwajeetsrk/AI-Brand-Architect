import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';

interface UserRecord {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  private users: UserRecord[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = this.users.find((u) => u.email === dto.email);
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user: UserRecord = {
      id: uuidv4(),
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: 'user',
      createdAt: new Date(),
    };

    this.users.push(user);

    return this.generateAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = this.users.find((u) => u.email === dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateAuthResponse(user);
  }

  async validateUser(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || 'nexora-dev-secret-key-change-in-production',
      });
      const user = this.users.find((u) => u.id === payload.sub);
      if (!user) return null;
      return payload;
    } catch {
      return null;
    }
  }

  private generateAuthResponse(user: UserRecord): AuthResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'nexora-dev-secret-key-change-in-production',
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
      }),
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
