import { Controller, Get, Post, Delete, Body, Query, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { SearchService } from './search.service';
import { SearchQueryDto, IndexDocumentDto, SearchResultsDto, SearchQueryMode } from './dto/search.dto';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search across all entity types' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'mode', required: false, enum: SearchQueryMode, description: 'keyword | semantic | hybrid' })
  @ApiQuery({ name: 'types', required: false, description: 'Comma-separated entity types to filter by' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async search(@Query() query: SearchQueryDto): Promise<SearchResultsDto> {
    const types = query.types ? query.types.split(',').map(t => t.trim().toUpperCase()) : undefined;
    const result = await this.searchService.search({
      query: query.q,
      mode: (query.mode || SearchQueryMode.KEYWORD) as any,
      limit: query.limit || 20,
      offset: query.offset || 0,
      minScore: query.minScore || 0,
      filters: {
        entityTypes: types as any,
        userId: query.userId,
        organizationId: query.organizationId,
        visibility: query.visibility as any,
      },
    });
    return {
      ...result,
      items: result.items.map(i => ({ ...i, description: i.description ?? undefined, content: i.content ?? undefined })),
    } as SearchResultsDto;
  }

  @Post('index')
  @ApiOperation({ summary: 'Index a document for search' })
  async index(@Body() body: IndexDocumentDto): Promise<{ id: string }> {
    const id = await this.searchService.indexDocument({
      entityType: body.entityType,
      entityId: body.entityId,
      title: body.title,
      description: body.description,
      content: body.content,
      tags: body.tags,
      metadata: body.metadata,
      userId: body.userId,
      organizationId: body.organizationId,
      visibility: body.visibility,
    });
    return { id };
  }

  @Delete('index')
  @ApiOperation({ summary: 'Remove a document from the search index' })
  @ApiQuery({ name: 'type', required: true })
  @ApiQuery({ name: 'id', required: true })
  async removeIndex(@Query('type') type: string, @Query('id') id: string): Promise<{ removed: boolean }> {
    await this.searchService.removeDocument(type, id);
    return { removed: true };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get search index statistics' })
  async getStats() {
    return this.searchService.getStats();
  }
}
