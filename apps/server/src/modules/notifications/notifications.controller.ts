import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user notifications' })
  list(@Param('userId') userId: string, @Query('limit') limit?: string, @Query('offset') offset?: string, @Query('unreadOnly') unreadOnly?: string): any {
    return this.svc.getUserNotifications(userId, Number(limit) || 50, Number(offset) || 0, unreadOnly === 'true');
  }

  @Post('send')
  @ApiOperation({ summary: 'Send a notification to a user' })
  send(@Body() data: { userId: string; channel: string; title: string; body: string; data?: any; referenceType?: string; referenceId?: string }): any {
    return this.svc.send(data as any);
  }

  @Post('send-bulk')
  @ApiOperation({ summary: 'Send bulk notifications' })
  sendBulk(@Body() data: { userIds: string[]; channel: string; title: string; body: string; data?: any; referenceType?: string; referenceId?: string }): any {
    return this.svc.sendBulk(data as any);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markRead(@Param('id') id: string): any { return this.svc.markAsRead(id); }

  @Put(':userId/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@Param('userId') userId: string): any { return this.svc.markAllAsRead(userId); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  delete(@Param('id') id: string): any { return this.svc.deleteNotification(id); }

  @Get(':userId/preferences')
  @ApiOperation({ summary: 'Get notification preferences' })
  getPreferences(@Param('userId') userId: string): any { return this.svc.getPreferences(userId); }

  @Put(':userId/preferences/:channel')
  @ApiOperation({ summary: 'Update notification preference for a channel' })
  updatePreference(@Param('userId') userId: string, @Param('channel') channel: string, @Body() data: { enabled?: boolean; types?: string[] }): any {
    return this.svc.updatePreference(userId, channel as any, data);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get notification templates' })
  getTemplates(@Query('channel') channel?: string): any { return this.svc.getTemplates(channel as any); }

  @Post('templates')
  @ApiOperation({ summary: 'Create a notification template' })
  createTemplate(@Body() data: { name: string; channel: string; subject?: string; body: string; variables?: string[] }): any {
    return this.svc.createTemplate(data as any);
  }

  @Post('templates/render')
  @ApiOperation({ summary: 'Render a template with variables' })
  renderTemplate(@Body() data: { name: string; vars: Record<string, string> }): any {
    return this.svc.renderTemplate(data.name, data.vars);
  }

  @Get(':userId/stats')
  @ApiOperation({ summary: 'Get notification stats' })
  getStats(@Param('userId') userId: string): any { return this.svc.getStats(userId); }
}
