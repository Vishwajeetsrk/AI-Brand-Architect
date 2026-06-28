import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
import { OAuthCallbackDto } from './dto/oauth-callback.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() dto: RegisterDto, @Req() req: any): Promise<AuthResponseDto> {
    return this.authService.register(dto, req.ip, req.headers['user-agent']);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Req() req: any): Promise<AuthResponseDto> {
    return this.authService.login(dto, req.ip, req.headers['user-agent']);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshDto, @Req() req: any): Promise<AuthResponseDto> {
    return this.authService.refresh(dto, req.ip, req.headers['user-agent']);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  async logout(@Body('refreshToken') refreshToken: string): Promise<void> {
    return this.authService.logout(refreshToken);
  }

  @Post('logout-all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from all devices' })
  async logoutAll(@CurrentUser('sub') userId: string): Promise<void> {
    return this.authService.logoutAll(userId);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    const { prisma } = await import('@nexora/database');
    const dbUser = await prisma.user.findUnique({
      where: { id: user.sub },
      select: { id: true, email: true, name: true, role: true, avatar: true, mfaEnabled: true, emailVerified: true },
    });
    return dbUser;
  }

  @Post('oauth/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle OAuth callback' })
  async oauthCallback(@Body() dto: OAuthCallbackDto, @Req() req: any): Promise<AuthResponseDto> {
    return this.authService.oauthCallback(dto.provider, dto.code, dto.redirectUri, req.ip, req.headers['user-agent']);
  }

  @Get('oauth/url/:provider')
  @ApiOperation({ summary: 'Get OAuth authorization URL' })
  async getOAuthUrl(@Param('provider') provider: string) {
    const urls: Record<string, string> = {
      google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.APP_URL || 'http://localhost:3000'}/api/auth/callback/google&response_type=code&scope=openid%20email%20profile&access_type=offline`,
      github: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.APP_URL || 'http://localhost:3000'}/api/auth/callback/github&scope=read:user%20user:email`,
    };
    const url = urls[provider];
    if (!url) throw new (await import('@nestjs/common')).BadRequestException(`Unsupported provider: ${provider}`);
    return { url };
  }

  @Post('mfa/setup')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Setup MFA (TOTP)' })
  async setupMfa(@CurrentUser('sub') userId: string, @Body() dto: MfaSetupDto) {
    return this.authService.setupMfa(userId, dto);
  }

  @Post('mfa/verify')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify MFA token' })
  async verifyMfa(@CurrentUser('sub') userId: string, @Body() dto: MfaVerifyDto) {
    return this.authService.verifyMfa(userId, dto);
  }

  @Post('mfa/disable')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable MFA' })
  async disableMfa(@CurrentUser('sub') userId: string): Promise<void> {
    return this.authService.disableMfa(userId);
  }

  @Post('organizations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create organization' })
  async createOrganization(@CurrentUser('sub') userId: string, @Body() dto: CreateOrganizationDto) {
    return this.authService.createOrganization(userId, dto);
  }

  @Get('organizations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user organizations' })
  async getOrganizations(@CurrentUser('sub') userId: string) {
    return this.authService.getOrganizations(userId);
  }

  @Post('organizations/:orgId/invite')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite member to organization' })
  async inviteMember(@Param('orgId') orgId: string, @CurrentUser('sub') userId: string, @Body() dto: InviteMemberDto) {
    return this.authService.inviteMember(orgId, userId, dto);
  }

  @Post('organizations/accept-invite')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept organization invitation' })
  async acceptInvite(@Body('token') token: string, @CurrentUser('sub') userId: string) {
    return this.authService.acceptInvite(token, userId);
  }
}
