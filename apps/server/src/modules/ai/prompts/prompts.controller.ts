import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { GenerateContentDto } from './dto/generate-content.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../../common/interfaces/request-with-user.interface';

@ApiTags('Prompts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prompt template' })
  create(@Body() dto: CreatePromptDto, @CurrentUser() user: JwtPayload) {
    return this.promptsService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prompt templates' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.promptsService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a prompt template by id' })
  findOne(@Param('id') id: string) {
    return this.promptsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prompt template' })
  remove(@Param('id') id: string) {
    return this.promptsService.remove(id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute a prompt template with brand data' })
  execute(@Param('id') id: string, @Body() dto: GenerateContentDto) {
    return this.promptsService.executePrompt(id, dto);
  }
}
