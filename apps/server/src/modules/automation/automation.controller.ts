import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AutomationService } from './automation.service';

@ApiTags('Automation')
@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Get all workflow templates' })
  getTemplates() {
    return this.automationService.getTemplates();
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get a workflow template by id' })
  getTemplate(@Param('id') id: string) {
    return this.automationService.getTemplate(id);
  }

  @Get('workflows')
  @ApiOperation({ summary: 'Get all workflows' })
  getWorkflows() {
    return this.automationService.getWorkflows();
  }

  @Post('workflows')
  @ApiOperation({ summary: 'Create a new workflow' })
  createWorkflow(@Body() data: { name: string; description?: string; templateId?: string }) {
    return this.automationService.createWorkflow(data);
  }

  @Get('workflows/:id')
  @ApiOperation({ summary: 'Get a workflow by id' })
  getWorkflow(@Param('id') id: string) {
    return this.automationService.getWorkflow(id);
  }

  @Put('workflows/:id')
  @ApiOperation({ summary: 'Update a workflow' })
  updateWorkflow(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.automationService.updateWorkflow(id, data);
  }

  @Delete('workflows/:id')
  @ApiOperation({ summary: 'Delete a workflow' })
  deleteWorkflow(@Param('id') id: string) {
    return this.automationService.deleteWorkflow(id);
  }

  @Post('workflows/:id/run')
  @ApiOperation({ summary: 'Execute a workflow' })
  async runWorkflow(@Param('id') id: string, @Body('trigger') trigger?: string) {
    return this.automationService.runWorkflow(id, trigger);
  }

  @Get('workflows/:id/runs')
  @ApiOperation({ summary: 'Get workflow run history' })
  getWorkflowRuns(@Param('id') id: string) {
    return this.automationService.getWorkflowRuns(id);
  }
}
