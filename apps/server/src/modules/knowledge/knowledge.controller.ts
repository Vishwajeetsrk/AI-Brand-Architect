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
  async getCategories(): Promise<any> { 
    return this.knowledgeService.getCategories(); 
  }

  @Get()
  @ApiOperation({ summary: 'Get articles' })
  async getArticles(@Query('categoryId') categoryId?: string): Promise<any> { 
    return this.knowledgeService.getArticles(categoryId); 
  }

  @Get('search')
  @ApiOperation({ summary: 'Search articles' })
  async search(@Query('q') query: string): Promise<any> { 
    return this.knowledgeService.search(query); 
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  async getArticle(@Param('id') id: string): Promise<any> { 
    return this.knowledgeService.getArticle(id); 
  }

  @Post()
  @ApiOperation({ summary: 'Create article' })
  async createArticle(@Body() data: { title: string; content: string; summary?: string; category?: string; tags?: string[] }): Promise<any> {
    return this.knowledgeService.createArticle(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update article' })
  async updateArticle(@Param('id') id: string, @Body() data: any): Promise<any> { 
    return this.knowledgeService.updateArticle(id, data); 
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete article' })
  async deleteArticle(@Param('id') id: string): Promise<any> { 
    return this.knowledgeService.deleteArticle(id); 
  }
}
