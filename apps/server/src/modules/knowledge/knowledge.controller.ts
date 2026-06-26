import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { KnowledgeService } from './knowledge.service';

@ApiTags('Knowledge')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get knowledge categories' })
  getCategories() { return this.knowledgeService.getCategories(); }

  @Get()
  @ApiOperation({ summary: 'Get articles' })
  getArticles(@Query('categoryId') categoryId?: string) { return this.knowledgeService.getArticles(categoryId); }

  @Get('search')
  @ApiOperation({ summary: 'Search articles' })
  search(@Query('q') query: string) { return this.knowledgeService.search(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  getArticle(@Param('id') id: string) { return this.knowledgeService.getArticle(id); }

  @Post()
  @ApiOperation({ summary: 'Create article' })
  createArticle(@Body() data: { title: string; content: string; summary?: string; category?: string; tags?: string[] }) {
    return this.knowledgeService.createArticle(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update article' })
  updateArticle(@Param('id') id: string, @Body() data: any) { return this.knowledgeService.updateArticle(id, data); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete article' })
  deleteArticle(@Param('id') id: string) { return this.knowledgeService.deleteArticle(id); }
}
