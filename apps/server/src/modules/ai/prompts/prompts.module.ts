import { Module, forwardRef } from '@nestjs/common';
import { PromptsController } from './prompts.controller';
import { PromptsService } from './prompts.service';
import { AiModule } from '../ai.module';
import { AuthModule } from '../../../modules/auth/auth.module';

@Module({
  imports: [forwardRef(() => AiModule), AuthModule],
  controllers: [PromptsController],
  providers: [PromptsService],
  exports: [PromptsService],
})
export class PromptsModule {}
