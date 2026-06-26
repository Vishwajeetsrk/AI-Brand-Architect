import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AutomationService } from './automation.service';

@ApiTags('Automation')
@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Get all workflow templates' })
  async getTemplates(): Promise<any> {
    return this.automationService.getTemplates();
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get a workflow template by id' })
  async getTemplate(@Param('id') id: string): Promise<any> {
    return this.automationService.getTemplate(id);
  }

  @Get('workflows')
  @ApiOperation({ summary: 'Get all workflows' })
  async getWorkflows(): Promise<any> {
    return this.automationService.getWorkflows();
  }

  @Post('workflows')
  @ApiOperation({ summary: 'Create a new workflow' })
  async createWorkflow(@Body() data: { name: string; description?: string; templateId?: string }): Promise<any> {
    return this.automationService.createWorkflow(data);
  }

  @Get('workflows/:id')
  @ApiOperation({ summary: 'Get a workflow by id' })
  async getWorkflow(@Param('id') id: string): Promise<any> {
    return this.automationService.getWorkflow(id);
  }

  @Put('workflows/:id')
  @ApiOperation({ summary: 'Update a workflow' })
  async updateWorkflow(@Param('id') id: string, @Body() data: Record<string, unknown>): Promise<any> {
    return this.automationService.updateWorkflow(id, data);
  }

  @Delete('workflows/:id')
  @ApiOperation({ summary: 'Delete a workflow' })
  async deleteWorkflow(@Param('id') id: string): Promise<any> {
    return this.automationService.deleteWorkflow(id);
  }

  @Post('workflows/:id/run')
  @ApiOperation({ summary: 'Execute a workflow' })
  async runWorkflow(@Param('id') id: string, @Body('trigger') trigger?: string): Promise<any> {
    return this.automationService.runWorkflow(id, trigger);
  }

  @Get('workflows/:id/runs')
  @ApiOperation({ summary: 'Get workflow run history' })
  async getWorkflowRuns(@Param('id') id: string): Promise<any> {
    return this.automationService.getWorkflowRuns(id);
  }
}
