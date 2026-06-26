import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { SecurityService } from './security.service';

@ApiTags('Security')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('events')
  @ApiOperation({ summary: 'Get security events with optional filters' })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getEvents(
    @Query('severity') severity?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.securityService.getEvents(
      severity as any, type as any, startDate, endDate,
    );
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get a single security event by ID' })
  async getEvent(@Param('id') id: string): Promise<any> {
    return this.securityService.getEvent(id);
  }

  @Get('policies')
  @ApiOperation({ summary: 'Get all security policies' })
  @ApiQuery({ name: 'category', required: false })
  async getPolicies(@Query('category') category?: string): Promise<any> {
    return this.securityService.getPolicies(category as any);
  }

  @Put('policies/:id')
  @ApiOperation({ summary: 'Toggle policy active/inactive status' })
  async togglePolicy(@Param('id') id: string): Promise<any> {
    return this.securityService.togglePolicy(id);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs with optional search' })
  @ApiQuery({ name: 'query', required: false })
  async getAuditLogs(@Query('query') query?: string): Promise<any> {
    return this.securityService.getAuditLogs(query);
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Get compliance reports' })
  async getCompliance(): Promise<any> {
    return this.securityService.getCompliance();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get security dashboard summary' })
  async getDashboard(): Promise<any> {
    return this.securityService.getDashboard();
  }

  @Get('simulate')
  @ApiOperation({ summary: 'Run threat simulation' })
  async simulate(): Promise<any> {
    return this.securityService.runThreatSimulation();
  }
}
