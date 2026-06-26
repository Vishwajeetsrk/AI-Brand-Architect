import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AuthGuard } from '../../common/guards/auth.guard';

class GenerateTextDto {
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate text using an AI model' })
  async generateText(@Body() dto: GenerateTextDto) {
    const content = await this.aiService.generateText(dto.model, dto.prompt, {
      systemPrompt: dto.systemPrompt,
      temperature: dto.temperature,
      maxTokens: dto.maxTokens,
    });
    return { content };
  }

  @Post('embed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate an embedding vector for text' })
  async generateEmbedding(@Body('text') text: string) {
    const embedding = await this.aiService.generateEmbedding(text);
    return { embedding };
  }
}
