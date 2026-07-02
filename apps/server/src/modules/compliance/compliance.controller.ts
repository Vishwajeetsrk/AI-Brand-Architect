import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { ComplianceService } from './compliance.service';
import { CreateReportDto, AuditLogFiltersDto } from './dto/compliance.dto';

@ApiTags('Compliance')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('reports')
  @ApiOperation({ summary: 'List all compliance reports' })
  async getReports(): Promise<any> {
    return this.complianceService.getReports();
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Get a single compliance report' })
  async getReport(@Param('id') id: string): Promise<any> {
    return this.complianceService.getReport(id);
  }

  @Post('reports')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new compliance report' })
  async createReport(@Body() dto: CreateReportDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.complianceService.createReport(dto);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'List audit logs' })
  async getAuditLogs(@Query() filters?: AuditLogFiltersDto): Promise<any> {
    return this.complianceService.getAuditLogs(filters);
  }

  @Get('audit-logs/:id')
  @ApiOperation({ summary: 'Get a single audit log entry' })
  async getAuditLog(@Param('id') id: string): Promise<any> {
    return this.complianceService.getAuditLog(id);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get compliance overview and statistics' })
  async getOverview(): Promise<any> {
    return this.complianceService.getOverview();
  }
}
