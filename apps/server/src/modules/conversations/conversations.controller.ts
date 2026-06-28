import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ConversationsService } from './conversations.service';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly svc: ConversationsService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new conversation' })
  create(@Param('userId') userId: string, @Body() data: { title?: string; projectId?: string; organizationId?: string; metadata?: any; systemPrompt?: string }): any {
    return this.svc.create(userId, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation with all messages' })
  get(@Param('id') id: string): any { return this.svc.get(id); }

  @Get('user/:userId')
  @ApiOperation({ summary: 'List user conversations' })
  list(@Param('userId') userId: string, @Query('limit') limit?: string, @Query('offset') offset?: string): any {
    return this.svc.list(userId, Number(limit) || 50, Number(offset) || 0);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update conversation title/metadata' })
  update(@Param('id') id: string, @Body() data: { title?: string; metadata?: any }): any {
    return this.svc.update(id, data);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive a conversation' })
  archive(@Param('id') id: string): any { return this.svc.archive(id); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a conversation' })
  delete(@Param('id') id: string): any { return this.svc.delete(id); }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add a message to a conversation' })
  addMessage(@Param('id') id: string, @Body() data: { role: string; content: string; parentId?: string; tokens?: number; metadata?: any; sources?: any }): any {
    return this.svc.addMessage(id, data);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  getMessages(@Param('id') id: string, @Query('limit') limit?: string, @Query('offset') offset?: string): any {
    return this.svc.getMessages(id, Number(limit) || 100, Number(offset) || 0);
  }

  @Get('thread/:messageId')
  @ApiOperation({ summary: 'Get a message thread (parent + replies)' })
  getThread(@Param('messageId') messageId: string): any { return this.svc.getThread(messageId); }

  @Post(':id/context')
  @ApiOperation({ summary: 'Build LLM context from conversation history' })
  buildContext(@Param('id') id: string, @Query('tokenBudget') tokenBudget?: string): any {
    return this.svc.buildContext(id, Number(tokenBudget) || 128000);
  }

  @Post(':id/compress')
  @ApiOperation({ summary: 'Compress conversation context (summarize old messages)' })
  compress(@Param('id') id: string): any { return this.svc.compressContext(id); }

  @Get('session/:userId')
  @ApiOperation({ summary: 'Get last active conversation (session recovery)' })
  getSession(@Param('userId') userId: string): any { return this.svc.getSessionState(userId); }

  @Get('search/:userId')
  @ApiOperation({ summary: 'Search conversations and messages' })
  search(@Param('userId') userId: string, @Query('q') q: string, @Query('limit') limit?: string): any {
    return this.svc.search(userId, q, Number(limit) || 20);
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Get conversation stats for user' })
  getStats(@Param('userId') userId: string): any { return this.svc.getStats(userId); }
}
