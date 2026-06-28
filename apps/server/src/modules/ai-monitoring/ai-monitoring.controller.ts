import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AiMonitoringService } from './ai-monitoring.service';
import { MonitoringQueryDto } from './dto/ai-monitoring.dto';

@ApiTags('AI Monitoring')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai-monitoring')
export class AiMonitoringController {
  constructor(private readonly monitoringService: AiMonitoringService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get aggregated monitoring statistics' })
  async getStats(@Query() query: MonitoringQueryDto): Promise<any> {
    return this.monitoringService.getStats({
      userId: query.userId,
      provider: query.provider,
      model: query.model,
      agentId: query.agentId,
      success: query.success,
      startDate: query.startDate,
      endDate: query.endDate,
    });
  }

  @Get('executions')
  @ApiOperation({ summary: 'Get paginated execution logs' })
  async getExecutions(@Query() query: MonitoringQueryDto): Promise<any> {
    return this.monitoringService.getExecutions({
      userId: query.userId,
      provider: query.provider,
      model: query.model,
      agentId: query.agentId,
      success: query.success,
      startDate: query.startDate,
      endDate: query.endDate,
      limit: query.limit ? Number(query.limit) : undefined,
      offset: query.offset ? Number(query.offset) : undefined,
    });
  }

  @Get('cost-by-provider')
  @ApiOperation({ summary: 'Get cost broken down by provider' })
  async getCostByProvider(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.monitoringService.getCostByProvider({ startDate, endDate });
  }

  @Get('model-quality')
  @ApiOperation({ summary: 'Get model quality metrics (latency, success rate, cost)' })
  async getModelQuality(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.monitoringService.getModelQuality({ startDate, endDate });
  }

  @Get('realtime')
  @ApiOperation({ summary: 'Get real-time metrics (last minute/hour)' })
  async getRealtime(): Promise<any> {
    return this.monitoringService.getRealtimeMetrics();
  }

  @Get('cost-breakdown')
  @ApiOperation({ summary: 'Get cost breakdown by model, provider, and time' })
  async getCostBreakdown(
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.monitoringService.getCostBreakdown({ userId, startDate, endDate });
  }

  @Get('error-analytics')
  @ApiOperation({ summary: 'Get error analytics grouped by model, provider, and time' })
  async getErrorAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.monitoringService.getErrorAnalytics({ startDate, endDate });
  }
}
