import { Module } from '@nestjs/common';
import { DocumentIntelligenceController } from './document-intelligence.controller';
import { DocumentIntelligenceService } from './document-intelligence.service';

@Module({
  controllers: [DocumentIntelligenceController],
  providers: [DocumentIntelligenceService],
  exports: [DocumentIntelligenceService],
})
export class DocumentIntelligenceModule {}
