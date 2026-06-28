import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RealtimeGateway } from './realtime.gateway';
import { SseController } from './sse.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'nexora-dev-secret-key-change-in-production',
    }),
  ],
  controllers: [SseController],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
