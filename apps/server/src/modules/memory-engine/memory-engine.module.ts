import { Module } from '@nestjs/common';
import { MemoryEngineController } from './memory-engine.controller';
import { MemoryEngineService } from './memory-engine.service';
import { ContextBuilderService } from './context-builder.service';
import { MemoryRankingService } from './memory-ranking.service';
import { MemoryCompressionService } from './memory-compression.service';

@Module({
  controllers: [MemoryEngineController],
  providers: [MemoryEngineService, ContextBuilderService, MemoryRankingService, MemoryCompressionService],
  exports: [MemoryEngineService, ContextBuilderService],
})
export class MemoryEngineModule {}
