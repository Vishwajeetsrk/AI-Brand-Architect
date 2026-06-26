import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatorService } from './creator.service';

@ApiTags('Creator')
@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get creator profile by user ID' })
  getProfile(@Param('userId') userId: string) {
    return this.creatorService.getProfile(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update creator profile' })
  updateProfile(@Body() data: { userId: string } & Record<string, any>) {
    const { userId, ...profile } = data;
    return this.creatorService.updateProfile(userId, profile);
  }

  @Get('content')
  @ApiOperation({ summary: 'Get creator content items' })
  getContent(@Query('creatorId') creatorId: string) {
    return this.creatorService.getContent(creatorId);
  }

  @Post('content')
  @ApiOperation({ summary: 'Publish new content' })
  publishContent(@Body() data: any) {
    return this.creatorService.publishContent(data);
  }

  @Put('content/:id')
  @ApiOperation({ summary: 'Update content item' })
  updateContent(@Param('id') id: string, @Body() data: any) {
    return this.creatorService.updateContent(id, data);
  }

  @Delete('content/:id')
  @ApiOperation({ summary: 'Delete content item' })
  deleteContent(@Param('id') id: string) {
    this.creatorService.deleteContent(id);
    return { success: true };
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get creator analytics' })
  getAnalytics(@Query('creatorId') creatorId: string, @Query('period') period?: string) {
    return this.creatorService.getAnalytics(creatorId, period);
  }

  @Get('payouts')
  @ApiOperation({ summary: 'Get payout history' })
  getPayouts(@Query('creatorId') creatorId: string) {
    return this.creatorService.getPayouts(creatorId);
  }

  @Post('payouts/request')
  @ApiOperation({ summary: 'Request a payout' })
  requestPayout(@Body() data: { creatorId: string; amount: number; method: string }) {
    return this.creatorService.requestPayout(data.creatorId, data.amount, data.method);
  }

  @Get('subscribers')
  @ApiOperation({ summary: 'Get subscriber list' })
  getSubscribers(@Query('creatorId') creatorId: string) {
    return this.creatorService.getSubscribers(creatorId);
  }
}
