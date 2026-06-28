import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Mock user validation - in production, query database
    const mockUser = {
      id: '1',
      email: 'demo@nexora.ai',
      password: await bcrypt.hash('password123', 10),
      name: 'Demo User',
      role: 'ADMIN',
      organizationId: '1',
    };

    if (email === mockUser.email) {
      const isPasswordValid = await bcrypt.compare(password, mockUser.password);
      if (isPasswordValid) {
        const { password: _, ...result } = mockUser;
        return result;
      }
    }
    return null;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, name: string): Promise<any> {
    // Mock registration - in production, save to database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      role: 'USER',
      organizationId: null,
    };

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        organizationId: payload.organizationId,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string): Promise<any> {
    // Mock - in production, send email with reset link
    return {
      message: 'Password reset email sent',
      email,
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    // Mock - in production, verify token and update password
    if (!token) {
      throw new BadRequestException('Invalid reset token');
    }

    return {
      message: 'Password reset successful',
    };
  }

  async verifyEmail(token: string): Promise<any> {
    // Mock - in production, verify email token
    return {
      message: 'Email verified successfully',
    };
  }

  async setupMFA(userId: string): Promise<any> {
    // Mock - in production, generate MFA secret
    return {
      secret: 'JBSWY3DPEHPK3PXP',
      qrCode: 'data:image/png;base64,mock-qr-code',
    };
  }

  async verifyMFA(userId: string, token: string): Promise<any> {
    // Mock - in production, verify MFA token
    if (token === '123456') {
      return {
        message: 'MFA verified successfully',
        backupCodes: ['12345678', '87654321'],
      };
    }
    throw new BadRequestException('Invalid MFA token');
  }

  async oauthCallback(provider: string, code: string): Promise<any> {
    // Mock - in production, exchange code for tokens
    return {
      accessToken: this.jwtService.sign({
        sub: '1',
        email: 'demo@nexora.ai',
        role: 'USER',
      }),
      user: {
        id: '1',
        email: 'demo@nexora.ai',
        name: 'OAuth User',
        provider,
      },
    };
  }

  async getProfile(userId: string): Promise<any> {
    // Mock - in production, query database
    return {
      id: userId,
      email: 'demo@nexora.ai',
      name: 'Demo User',
      role: 'ADMIN',
      organizationId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateProfile(userId: string, data: any): Promise<any> {
    // Mock - in production, update database
    return {
      id: userId,
      ...data,
      updatedAt: new Date(),
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<any> {
    // Mock - in production, verify old password and update
    return {
      message: 'Password changed successfully',
    };
  }
}