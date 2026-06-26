import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { AgentRuntime } from './agent.runtime';
import { BrandAnalysisSkill } from './skills/brand-analysis.skill';
import { ContentGenerationSkill } from './skills/content-generation.skill';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AiModule, AuthModule],
  controllers: [AgentsController],
  providers: [AgentsService, AgentRuntime, BrandAnalysisSkill, ContentGenerationSkill],
  exports: [AgentsService, AgentRuntime],
})
export class AgentsModule {}
