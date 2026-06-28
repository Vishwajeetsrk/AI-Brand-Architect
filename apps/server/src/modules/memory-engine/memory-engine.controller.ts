import { Controller, Post, Get, Body, Param, Query, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MemoryEngineService } from './memory-engine.service';
import { ContextBuilderService } from './context-builder.service';
import { MemoryRankingService } from './memory-ranking.service';
import { MemoryCompressionService } from './memory-compression.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Memory Engine')
@Controller('memory')
export class MemoryEngineController {
  constructor(
    private readonly memory: MemoryEngineService,
    private readonly contextBuilder: ContextBuilderService,
    private readonly ranking: MemoryRankingService,
    private readonly compression: MemoryCompressionService,
  ) {}

  @Post('store')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Store a memory entry' })
  async store(@Body() body: any) {
    return this.memory.store(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a memory entry' })
  async get(@Param('id') id: string) {
    return this.memory.get(id);
  }

  @Get('scope/:scope/:scopeId')
  @ApiOperation({ summary: 'Retrieve memory by scope' })
  async retrieve(@Param('scope') scope: string, @Param('scopeId') scopeId: string, @Query('type') type: string, @Query('limit') limit: string) {
    return this.memory.retrieve(scope as any, scopeId, { type, limit: limit ? parseInt(limit) : undefined });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search memory by content' })
  async search(@Query('q') q: string, @Query('scope') scope: string, @Query('limit') limit: string) {
    return this.memory.searchByContent(q, { scope: scope as any, limit: limit ? parseInt(limit) : undefined });
  }

  @Post('context')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Build context from memory hierarchy' })
  async buildContext(@CurrentUser('sub') userId: string, @Body() body: any) {
    return this.contextBuilder.buildContext(userId, { projectId: body.projectId, brandId: body.brandId, query: body.query });
  }

  @Post('rank')
  @ApiOperation({ summary: 'Rank memory entries' })
  async rank(@Body('scope') scope: string, @Body('scopeId') scopeId: string, @Body('query') query: string) {
    return this.ranking.rank(scope as any, scopeId, query);
  }

  @Post('compress')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Compress old memory entries' })
  async compress(@Body('scope') scope: string, @Body('scopeId') scopeId: string, @Body('type') type: string) {
    return this.compression.compress(scope as any, scopeId, type);
  }

  @Post('feedback')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record memory feedback' })
  async feedback(@Body('memoryId') memoryId: string, @Body('helpful') helpful: boolean) {
    return this.ranking.recordFeedback(memoryId, helpful);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a memory entry' })
  async delete(@Param('id') id: string) {
    return this.memory.delete(id);
  }
}
