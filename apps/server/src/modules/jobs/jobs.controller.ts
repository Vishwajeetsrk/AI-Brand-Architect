import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { JobsService } from './jobs.service';

@ApiTags('Jobs / Background Workers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Post('enqueue')
  @ApiOperation({ summary: 'Enqueue a background job' })
  enqueue(@Body() data: { type: string; data: any; queueName?: string; priority?: number; delay?: number; userId?: string; organizationId?: string }): any {
    return this.jobs.enqueue(data.type as any, data.data, {
      queueName: data.queueName as any, priority: data.priority, delay: data.delay,
      userId: data.userId, organizationId: data.organizationId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List jobs with optional filters' })
  list(@Query('type') type?: string, @Query('status') status?: string, @Query('limit') limit?: string, @Query('offset') offset?: string): any {
    return this.jobs.listJobs({ type, status, limit: Number(limit) || 50, offset: Number(offset) || 0 });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get queue statistics' })
  stats(): any { return this.jobs.getQueueStats(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details' })
  get(@Param('id') id: string): any { return this.jobs.getJob(id); }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a queued/active job' })
  cancel(@Param('id') id: string): any { return this.jobs.cancelJob(id); }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry a failed job' })
  retry(@Param('id') id: string): any { return this.jobs.retryJob(id); }
}
