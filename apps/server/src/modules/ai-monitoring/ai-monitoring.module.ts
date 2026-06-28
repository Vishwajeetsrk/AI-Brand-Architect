import { Module } from '@nestjs/common';
import { AiMonitoringController } from './ai-monitoring.controller';
import { AiMonitoringService } from './ai-monitoring.service';

@Module({
  controllers: [AiMonitoringController],
  providers: [AiMonitoringService],
  exports: [AiMonitoringService],
})
export class AiMonitoringModule {}
