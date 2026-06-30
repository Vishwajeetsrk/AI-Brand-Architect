import { Module } from '@nestjs/common';
import { CareerRoadmapController } from './career-roadmap.controller';
import { CareerRoadmapService } from './career-roadmap.service';

@Module({
  controllers: [CareerRoadmapController],
  providers: [CareerRoadmapService],
  exports: [CareerRoadmapService],
})
export class CareerRoadmapModule {}
