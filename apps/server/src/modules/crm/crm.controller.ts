import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CrmService } from './crm.service';

@ApiTags('CRM')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get CRM dashboard summary' })
  getDashboard() { return this.crmService.getDashboard(); }

  @Get('contacts')
  @ApiOperation({ summary: 'Get all contacts' })
  getContacts() { return this.crmService.getContacts(); }

  @Post('contacts')
  @ApiOperation({ summary: 'Create a contact' })
  createContact(@Body() data: any) { return this.crmService.createContact(data); }

  @Put('contacts/:id')
  @ApiOperation({ summary: 'Update a contact' })
  updateContact(@Param('id') id: string, @Body() data: any) { return this.crmService.updateContact(id, data); }

  @Delete('contacts/:id')
  @ApiOperation({ summary: 'Delete a contact' })
  deleteContact(@Param('id') id: string) { return this.crmService.deleteContact(id); }

  @Get('deals')
  @ApiOperation({ summary: 'Get all deals' })
  getDeals() { return this.crmService.getDeals(); }

  @Post('deals')
  @ApiOperation({ summary: 'Create a deal' })
  createDeal(@Body() data: any) { return this.crmService.createDeal(data); }

  @Put('deals/:id/stage')
  @ApiOperation({ summary: 'Update deal stage' })
  updateDealStage(@Param('id') id: string, @Body() data: { stage: string }) { return this.crmService.updateDealStage(id, data.stage as any); }

  @Get('pipelines')
  @ApiOperation({ summary: 'Get all pipelines' })
  getPipelines() { return this.crmService.getPipelines(); }

  @Get('campaigns')
  @ApiOperation({ summary: 'Get all campaigns' })
  getCampaigns() { return this.crmService.getCampaigns(); }

  @Post('campaigns')
  @ApiOperation({ summary: 'Create a campaign' })
  createCampaign(@Body() data: any) { return this.crmService.createCampaign(data); }

  @Get('tickets')
  @ApiOperation({ summary: 'Get all tickets' })
  getTickets() { return this.crmService.getTickets(); }

  @Post('tickets')
  @ApiOperation({ summary: 'Create a ticket' })
  createTicket(@Body() data: any) { return this.crmService.createTicket(data); }

  @Put('tickets/:id/status')
  @ApiOperation({ summary: 'Update ticket status' })
  updateTicketStatus(@Param('id') id: string, @Body() data: { status: string }) { return this.crmService.updateTicketStatus(id, data.status as any); }
}
