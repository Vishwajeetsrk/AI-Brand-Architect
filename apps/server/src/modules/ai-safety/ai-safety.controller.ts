import { Controller, Get, Post, Body, Param, Query, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AISafetyService } from './ai-safety.service';
import { SafetyQueryDto, SafetyConfigDto } from './dto/ai-safety.dto';

@ApiTags('AI Safety')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai-safety')
export class AISafetyController {
  constructor(private readonly safetyService: AISafetyService) {}

  @Get('events')
  @ApiOperation({ summary: 'Get paginated safety events' })
  async getEvents(@Query() query: SafetyQueryDto): Promise<any> {
    return this.safetyService.getEvents(query);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get single safety event' })
  async getEvent(@Param('id') id: string): Promise<any> {
    return this.safetyService.getEvent(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get safety event statistics' })
  async getStats(@Query() query: SafetyQueryDto) {
    return this.safetyService.getStats(query);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get safety dashboard overview' })
  async getDashboard() {
    return this.safetyService.getDashboard();
  }

  @Get('config')
  @ApiOperation({ summary: 'Get safety engine config' })
  async getConfig() {
    return this.safetyService.getSafetyConfig();
  }

  @Put('config')
  @ApiOperation({ summary: 'Update safety engine config' })
  async updateConfig(@Body() dto: SafetyConfigDto) {
    return this.safetyService.updateSafetyConfig(dto);
  }

  @Get('events-by-type')
  @ApiOperation({ summary: 'Get events grouped by type' })
  async getEventsByType(@Query() query: SafetyQueryDto) {
    return this.safetyService.getEventsByType(query);
  }
}
