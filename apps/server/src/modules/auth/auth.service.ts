import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { prisma } from '@nexora/database';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';

const JWT_SECRET = () => process.env.JWT_SECRET || 'nexora-dev-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('A user with this email already exists');

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: hashedPassword,
        role: 'USER',
      },
    });

    if (dto.organizationName) {
      const slug = dto.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'org-' + user.id.slice(0, 8);
      await prisma.organization.create({
        data: {
          name: dto.organizationName,
          slug,
          members: { create: { userId: user.id, role: 'OWNER' } },
        },
      });
    }

    return this.generateAuthResponse(user, ipAddress, userAgent);
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid email or password');

    if (user.banned) throw new UnauthorizedException('Account has been banned');

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    return this.generateAuthResponse(user, ipAddress, userAgent);
  }

  async refresh(dto: RefreshDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const session = await prisma.session.findUnique({ where: { refreshToken: dto.refreshToken } });
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || user.banned) throw new UnauthorizedException('User not found or banned');

    await prisma.session.delete({ where: { id: session.id } });

    return this.generateAuthResponse(user, ipAddress, userAgent);
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.session.deleteMany({ where: { refreshToken } });
  }

  async logoutAll(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } });
  }

  async oauthCallback(provider: string, code: string, redirectUri?: string, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const tokenResponse = await this.exchangeOAuthCode(provider, code, redirectUri);
    const profile = await this.getOAuthProfile(provider, tokenResponse.accessToken);

    const existingAccount = await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId: profile.id } },
      include: { user: true },
    });

    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { accessToken: tokenResponse.accessToken, refreshToken: tokenResponse.refreshToken },
      });
      return this.generateAuthResponse(existingAccount.user, ipAddress, userAgent);
    }

    const existingUser = profile.email ? await prisma.user.findUnique({ where: { email: profile.email } }) : null;

    let user = existingUser;
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email || `${profile.id}@${provider}.id`,
          name: profile.name || `User ${profile.id.slice(0, 8)}`,
          emailVerified: true,
          role: 'USER',
        },
      });
    }

    await prisma.account.create({
      data: {
        userId: user.id,
        provider,
        providerAccountId: profile.id,
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        tokenType: 'bearer',
        scope: tokenResponse.scope,
        idToken: tokenResponse.idToken,
      },
    });

    return this.generateAuthResponse(user, ipAddress, userAgent);
  }

  async setupMfa(userId: string, _dto: MfaSetupDto): Promise<{ secret: string; qrCodeUrl: string; backupCodes: string[] }> {
    const speakeasy = await import('speakeasy').catch(() => null);
    if (!speakeasy) throw new BadRequestException('MFA library not available');

    const secret = speakeasy.generateSecret({ name: `NEXORA:${userId.slice(0, 8)}` });
    const backupCodes = Array.from({ length: 8 }, () => randomBytes(4).toString('hex'));

    await prisma.mFAMethod.create({
      data: {
        userId,
        type: 'totp',
        secret: secret.base32,
        backupCodes,
      },
    });

    return { secret: secret.base32, qrCodeUrl: secret.otpauth_url || '', backupCodes };
  }

  async verifyMfa(userId: string, dto: MfaVerifyDto): Promise<{ verified: boolean }> {
    const method = await prisma.mFAMethod.findFirst({
      where: { userId, type: 'totp', enabled: true },
    });
    if (!method) throw new BadRequestException('No MFA method configured');

    const speakeasy = await import('speakeasy').catch(() => null);
    if (!speakeasy) throw new BadRequestException('MFA library not available');

    const verified = speakeasy.totp.verify({
      secret: method.secret,
      encoding: 'base32',
      token: dto.token,
    });

    if (!verified && method.backupCodes.includes(dto.token)) {
      const remaining = method.backupCodes.filter(c => c !== dto.token);
      await prisma.mFAMethod.update({
        where: { id: method.id },
        data: { backupCodes: remaining },
      });
      await prisma.user.update({ where: { id: userId }, data: { mfaEnabled: true } });
      return { verified: true };
    }

    if (verified) {
      await prisma.user.update({ where: { id: userId }, data: { mfaEnabled: true } });
    }

    return { verified };
  }

  async disableMfa(userId: string): Promise<void> {
    await prisma.mFAMethod.deleteMany({ where: { userId } });
    await prisma.user.update({ where: { id: userId }, data: { mfaEnabled: false, totpSecret: null } });
  }

  async createOrganization(userId: string, dto: CreateOrganizationDto) {
    const existing = await prisma.organization.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('An organization with this slug already exists');

    return prisma.organization.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        domain: dto.domain,
        members: { create: { userId, role: 'OWNER' } },
      },
    });
  }

  async inviteMember(organizationId: string, inviterId: string, dto: InviteMemberDto) {
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId, userId: inviterId } },
    });
    if (!member || member.role === 'VIEWER') throw new UnauthorizedException('Not authorized to invite members');

    const existingToken = await prisma.verificationToken.findFirst({
      where: { identifier: dto.email, type: 'org_invite' },
    });
    if (existingToken) throw new ConflictException('Invitation already sent to this email');

    const token = randomBytes(32).toString('hex');
    await prisma.verificationToken.create({
      data: {
        identifier: dto.email,
        token,
        type: 'org_invite',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { message: 'Invitation sent', email: dto.email, token };
  }

  async acceptInvite(token: string, userId: string): Promise<{ organizationId: string }> {
    const invite = await prisma.verificationToken.findUnique({ where: { token } });
    if (!invite || invite.expiresAt < new Date()) throw new BadRequestException('Invalid or expired invitation');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    await prisma.verificationToken.delete({ where: { id: invite.id } });

    const org = await prisma.organization.findFirst({ where: {} });
    if (!org) throw new BadRequestException('Organization not found');

    const existing = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: org.id, userId } },
    });
    if (!existing) {
      await prisma.organizationMember.create({
        data: { organizationId: org.id, userId, role: 'MEMBER' },
      });
    }

    return { organizationId: org.id };
  }

  async getOrganizations(userId: string) {
    return prisma.organizationMember.findMany({
      where: { userId },
      include: { organization: true },
    });
  }

  async validateUser(token: string): Promise<JwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, { secret: JWT_SECRET() });
    } catch {
      return null;
    }
  }

  private async generateAuthResponse(user: { id: string; email: string; name: string; role: string }, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const refreshToken = randomBytes(40).toString('hex');

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: this.jwtService.sign(payload, { secret: JWT_SECRET(), expiresIn: ACCESS_TOKEN_EXPIRY }),
      refreshToken,
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  private async exchangeOAuthCode(provider: string, code: string, redirectUri?: string): Promise<{ accessToken: string; refreshToken?: string; scope?: string; idToken?: string }> {
    const configs: Record<string, { tokenUrl: string; clientId: string; clientSecret: string; redirectUri: string }> = {
      google: {
        tokenUrl: 'https://oauth2.googleapis.com/token',
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirectUri: redirectUri || `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/callback/google`,
      },
      github: {
        tokenUrl: 'https://github.com/login/oauth/access_token',
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        redirectUri: redirectUri || `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/callback/github`,
      },
    };

    const config = configs[provider];
    if (!config) throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    if (data.error) throw new UnauthorizedException(`OAuth error: ${data.error_description || data.error}`);

    return { accessToken: data.access_token, refreshToken: data.refresh_token, scope: data.scope, idToken: data.id_token };
  }

  private async getOAuthProfile(provider: string, accessToken: string): Promise<{ id: string; email?: string; name?: string; avatar?: string }> {
    const profileUrls: Record<string, string> = {
      google: 'https://www.googleapis.com/oauth2/v2/userinfo',
      github: 'https://api.github.com/user',
    };

    const url = profileUrls[provider];
    if (!url) throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();

    if (provider === 'google') return { id: data.id, email: data.email, name: data.name, avatar: data.picture };
    if (provider === 'github') return { id: String(data.id), email: data.email, name: data.name, avatar: data.avatar_url };

    return { id: String(data.id) };
  }
}
