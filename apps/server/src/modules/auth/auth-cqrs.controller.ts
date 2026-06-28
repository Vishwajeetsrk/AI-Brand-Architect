import { Controller, Post, Get, Body, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserCommand } from './commands/register-user.command';
import { LoginUserCommand } from './commands/login-user.command';
import { GetUserQuery } from './queries/get-user.query';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Auth (CQRS)')
@Controller('api/auth')
export class AuthCqrsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register with CQRS' })
  async register(@Body() dto: RegisterDto, @Req() req: any) {
    return this.commandBus.execute(
      new RegisterUserCommand(dto.email, dto.password, dto.name, dto.organizationName, req.ip, req.headers['user-agent']),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with CQRS' })
  async login(@Body() dto: LoginDto, @Req() req: any) {
    return this.commandBus.execute(
      new LoginUserCommand(dto.email, dto.password, req.ip, req.headers['user-agent']),
    );
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile via CQRS query' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.queryBus.execute(new GetUserQuery(user.sub));
  }
}
