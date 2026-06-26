import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CollaborationService } from './collaboration.service';

@ApiTags('Collaboration')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Get('teams')
  @ApiOperation({ summary: 'Get all teams' })
  getTeams() { return this.collaborationService.getTeams(); }

  @Post('teams')
  @ApiOperation({ summary: 'Create a team' })
  createTeam(@Body() data: { name: string; description?: string; organizationId: string }) {
    return this.collaborationService.createTeam(data);
  }

  @Get('teams/:id')
  @ApiOperation({ summary: 'Get team by ID' })
  getTeam(@Param('id') id: string) { return this.collaborationService.getTeam(id); }

  @Get('teams/:id/channels')
  @ApiOperation({ summary: 'Get channels for a team' })
  getChannels(@Param('id') teamId: string) { return this.collaborationService.getChannels(teamId); }

  @Post('channels')
  @ApiOperation({ summary: 'Create a channel' })
  createChannel(@Body() data: { name: string; teamId: string; topic?: string; type?: string }) {
    return this.collaborationService.createChannel(data as any);
  }

  @Get('channels/:id/messages')
  @ApiOperation({ summary: 'Get messages for a channel' })
  getMessages(@Param('id') channelId: string) { return this.collaborationService.getMessages(channelId); }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message' })
  createMessage(@Body() data: { content: string; channelId: string; userId: string; mentions?: string[]; attachments?: string[] }) {
    return this.collaborationService.createMessage(data);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get calendars' })
  getCalendar() { return this.collaborationService.getCalendar(); }

  @Post('events')
  @ApiOperation({ summary: 'Create an event' })
  createEvent(@Body() data: { title: string; description?: string; startTime: string; endTime: string; calendarId: string; organizerId: string; participants?: string[]; recurring?: boolean }) {
    return this.collaborationService.createEvent(data);
  }
}
