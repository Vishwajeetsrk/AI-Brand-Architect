import { Module } from '@nestjs/common';
import { AISafetyController } from './ai-safety.controller';
import { AISafetyService } from './ai-safety.service';

@Module({
  controllers: [AISafetyController],
  providers: [AISafetyService],
  exports: [AISafetyService],
})
export class AISafetyModule {}
