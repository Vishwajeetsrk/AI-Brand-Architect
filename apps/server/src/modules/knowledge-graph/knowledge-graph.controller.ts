import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GraphService } from './graph.service';
import { EntityResolverService } from './entity-resolver.service';
import { ContextBuilderService } from './context-builder.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Knowledge Graph')
@Controller('knowledge-graph')
export class KnowledgeGraphController {
  constructor(
    private readonly graph: GraphService,
    private readonly resolver: EntityResolverService,
    private readonly contextBuilder: ContextBuilderService,
  ) {}

  @Post('nodes')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a graph node' })
  async createNode(@Body() body: any) {
    return this.graph.createNode(body);
  }

  @Get('nodes/:id')
  @ApiOperation({ summary: 'Get a node by ID' })
  async getNode(@Param('id') id: string) {
    return this.graph.getNode(id);
  }

  @Get('nodes')
  @ApiOperation({ summary: 'Search nodes' })
  async findNodes(@Query('type') type: string, @Query('q') q: string, @Query('tags') tags: string) {
    return this.graph.findNodes(type as any, q, tags ? tags.split(',') : undefined);
  }

  @Post('nodes/upsert')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upsert node from source' })
  async upsertNode(@Body() body: any) {
    return this.graph.upsertFromSource(body);
  }

  @Post('relationships')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a relationship' })
  async createRelationship(@Body() body: any) {
    return this.graph.createRelationship(body);
  }

  @Get('nodes/:id/neighbors')
  @ApiOperation({ summary: 'Get neighboring nodes' })
  async getNeighbors(@Param('id') id: string, @Query('depth') depth: string) {
    return this.graph.getNeighbors(id, depth ? parseInt(depth) : 1);
  }

  @Get('nodes/:id/relationships')
  @ApiOperation({ summary: 'Get node relationships' })
  async getRelationships(@Param('id') id: string, @Query('direction') direction: string, @Query('type') type: string) {
    return this.graph.getRelationships(id, direction as any, type);
  }

  @Get('path')
  @ApiOperation({ summary: 'Find shortest path between nodes' })
  async findPath(@Query('from') from: string, @Query('to') to: string) {
    return this.graph.findPath(from, to);
  }

  @Post('resolve')
  @ApiOperation({ summary: 'Resolve an entity by name' })
  async resolveEntity(@Body('name') name: string, @Body('type') type: string) {
    return this.resolver.resolveEntity(name, type);
  }

  @Post('context')
  @ApiOperation({ summary: 'Build AI context from graph' })
  async buildContext(@Body('query') query: string, @Body('depth') depth: number) {
    if (!query) throw new (await import('@nestjs/common')).BadRequestException('query is required');
    return this.contextBuilder.buildContext(query, { depth });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get graph statistics' })
  async getStats() {
    return this.graph.getStats();
  }
}
