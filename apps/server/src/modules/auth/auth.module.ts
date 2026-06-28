import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { AuthCqrsController } from './auth-cqrs.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RegisterUserHandler } from './commands/register-user.handler';
import { LoginUserHandler } from './commands/login-user.handler';
import { GetUserHandler } from './queries/get-user.handler';
import { UserRegisteredEventHandler, UserLoggedInEventHandler } from './events/event-handlers';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'nexora-dev-secret-key-change-in-production',
      signOptions: { expiresIn: '15m' },
    }),
    CqrsModule,
  ],
  controllers: [AuthController, AuthCqrsController],
  providers: [
    AuthService,
    JwtStrategy,
    RegisterUserHandler,
    LoginUserHandler,
    GetUserHandler,
    UserRegisteredEventHandler,
    UserLoggedInEventHandler,
  ],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
