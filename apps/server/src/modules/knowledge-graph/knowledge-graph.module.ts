import { Module } from '@nestjs/common';
import { KnowledgeGraphController } from './knowledge-graph.controller';
import { GraphService } from './graph.service';
import { EntityResolverService } from './entity-resolver.service';
import { ContextBuilderService } from './context-builder.service';

@Module({
  controllers: [KnowledgeGraphController],
  providers: [GraphService, EntityResolverService, ContextBuilderService],
  exports: [GraphService, EntityResolverService, ContextBuilderService],
})
export class KnowledgeGraphModule {}
