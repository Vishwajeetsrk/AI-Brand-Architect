import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard analytics metrics' })
  async getDashboard() {
    return this.analyticsService.getDashboardMetrics();
  }

  @Get('brands/:brandId/health')
  @ApiOperation({ summary: 'Get brand health score' })
  async getBrandHealth(@Param('brandId') brandId: string) {
    return this.analyticsService.getBrandHealth(brandId);
  }

  @Get('engagement')
  @ApiOperation({ summary: 'Get engagement metrics' })
  async getEngagement() {
    return this.analyticsService.getEngagementMetrics();
  }
}
