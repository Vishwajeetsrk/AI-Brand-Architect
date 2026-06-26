import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('brands')
  @ApiOperation({ summary: 'Get brand analytics' })
  @ApiQuery({ name: 'brandId', required: false })
  getBrandAnalytics(@CurrentUser() user: JwtPayload, @Query('brandId') brandId?: string) {
    return this.analyticsService.getBrandAnalytics(user.sub, brandId);
  }

  @Get('projects')
  @ApiOperation({ summary: 'Get project analytics' })
  @ApiQuery({ name: 'projectId', required: false })
  getProjectAnalytics(@CurrentUser() user: JwtPayload, @Query('projectId') projectId?: string) {
    return this.analyticsService.getProjectAnalytics(user.sub, projectId);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get usage analytics' })
  getUsageAnalytics(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getUsageAnalytics(user.sub);
  }

  @Get('ai')
  @ApiOperation({ summary: 'Get AI usage analytics' })
  getAIAnalytics(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getAIAnalytics(user.sub);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance metrics' })
  getPerformanceMetrics(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getPerformanceMetrics(user.sub);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  getRevenueAnalytics(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getRevenueAnalytics(user.sub);
  }

  @Get('team')
  @ApiOperation({ summary: 'Get team analytics' })
  getTeamAnalytics(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getTeamAnalytics(user.sub);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export analytics data' })
  exportAnalytics(@CurrentUser() user: JwtPayload, @Query('format') format: string = 'csv') {
    return this.analyticsService.exportAnalytics(user.sub, format);
  }
}