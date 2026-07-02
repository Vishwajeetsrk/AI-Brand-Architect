import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { FeatureFlagsService } from './feature-flags.service';
import { CreateFlagDto, UpdateFlagDto, EvaluateFlagsDto } from './dto/feature-flags.dto';

@ApiTags('Feature Flags')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly flagsService: FeatureFlagsService) {}

  @Get()
  @ApiOperation({ summary: 'List all feature flags' })
  async findAll(@Query('tag') tag?: string): Promise<any> {
    return this.flagsService.findAll(tag);
  }

  @Get('evaluate-all')
  @ApiOperation({ summary: 'Evaluate all flags for a given context' })
  async evaluateAll(@Query() context: EvaluateFlagsDto): Promise<any> {
    return this.flagsService.evaluateAll(context);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single feature flag' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.flagsService.findOne(id);
  }

  @Get('by-key/:key')
  @ApiOperation({ summary: 'Get a feature flag by key' })
  async findByKey(@Param('key') key: string): Promise<any> {
    return this.flagsService.findByKey(key);
  }

  @Get(':key/evaluate')
  @ApiOperation({ summary: 'Evaluate a single flag for a given context' })
  async evaluate(@Param('key') key: string, @Query() context: EvaluateFlagsDto): Promise<any> {
    const result = await this.flagsService.evaluate(key, context);
    return { key, enabled: result };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new feature flag' })
  async create(@Body() dto: CreateFlagDto): Promise<any> {
    return this.flagsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a feature flag' })
  async update(@Param('id') id: string, @Body() dto: UpdateFlagDto): Promise<any> {
    return this.flagsService.update(id, dto);
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: 'Toggle a feature flag on/off' })
  async toggle(@Param('id') id: string): Promise<any> {
    return this.flagsService.toggle(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feature flag' })
  async remove(@Param('id') id: string): Promise<any> {
    return this.flagsService.remove(id);
  }
}
