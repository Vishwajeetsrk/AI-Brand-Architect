import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ReflectionService } from './reflection.service';
import { EvaluateTaskDto, RecordFeedbackDto, BatchEvaluateDto } from './dto/reflection.dto';

@ApiTags('Reflection')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reflection')
export class ReflectionController {
  constructor(private readonly reflectionService: ReflectionService) {}

  @Post('evaluate')
  @ApiOperation({ summary: 'Evaluate a task output and return reflection result' })
  async evaluate(@Body() dto: EvaluateTaskDto): Promise<any> {
    return this.reflectionService.evaluate(dto.taskId, dto.taskDescription, dto.output, dto.retryCount || 0, dto.capabilities || []);
  }

  @Post('batch-evaluate')
  @ApiOperation({ summary: 'Evaluate multiple task outputs' })
  async batchEvaluate(@Body() dto: BatchEvaluateDto): Promise<any[]> {
    return this.reflectionService.batchEvaluate(dto.tasks.map(t => ({
      taskId: t.taskId,
      taskDescription: t.taskDescription,
      output: t.output,
      retryCount: t.retryCount,
      capabilities: t.capabilities,
    })));
  }

  @Get()
  @ApiOperation({ summary: 'List reflection results' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'passed', required: false, type: Boolean })
  @ApiQuery({ name: 'needsRetry', required: false, type: Boolean })
  async list(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('passed') passed?: string,
    @Query('needsRetry') needsRetry?: string,
  ): Promise<any> {
    return this.reflectionService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      passed: passed !== undefined ? passed === 'true' : undefined,
      needsRetry: needsRetry !== undefined ? needsRetry === 'true' : undefined,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get reflection statistics' })
  async getStats(): Promise<any> {
    return this.reflectionService.getStats();
  }

  @Get('calibration')
  @ApiOperation({ summary: 'Get confidence calibration data' })
  async getCalibration(): Promise<any> {
    return this.reflectionService.getCalibration();
  }

  @Get('suggest')
  @ApiOperation({ summary: 'Get alternative approach suggestion' })
  @ApiQuery({ name: 'task', required: true })
  @ApiQuery({ name: 'error', required: false })
  @ApiQuery({ name: 'retryCount', required: false, type: Number })
  async suggest(
    @Query('task') task: string,
    @Query('error') error?: string,
    @Query('retryCount') retryCount?: string,
  ): Promise<{ suggestion: string }> {
    const suggestion = await this.reflectionService.getAlternative(task, error, retryCount ? Number(retryCount) : 0);
    return { suggestion };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reflection result by ID' })
  async getById(@Param('id') id: string): Promise<any> {
    return this.reflectionService.getResult(id);
  }

  @Get('by-task/:taskId')
  @ApiOperation({ summary: 'Get reflection results for a task' })
  async getByTaskId(@Param('taskId') taskId: string): Promise<any[]> {
    return this.reflectionService.getResultsByTaskId(taskId);
  }

  @Post('feedback')
  @ApiOperation({ summary: 'Record user feedback on a reflection' })
  async recordFeedback(@Body() dto: RecordFeedbackDto): Promise<{ recorded: boolean }> {
    await this.reflectionService.recordFeedback(dto.taskId, dto.predictedScore, dto.actualScore, dto.corrected, dto.userFeedback);
    return { recorded: true };
  }
}
