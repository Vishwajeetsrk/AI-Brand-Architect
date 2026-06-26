import { Module, forwardRef } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OpenAIProvider } from './providers/openai.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { ProviderFactory } from './providers/provider-factory';
import { PromptsModule } from './prompts/prompts.module';
import { RagModule } from './rag/rag.module';
import { AuthModule } from '../../modules/auth/auth.module';

@Module({
  imports: [forwardRef(() => PromptsModule), forwardRef(() => RagModule), AuthModule],
  controllers: [AiController],
  providers: [AiService, OpenAIProvider, AnthropicProvider, ProviderFactory],
  exports: [AiService, OpenAIProvider, AnthropicProvider, ProviderFactory],
})
export class AiModule {}
