import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { GamificationService } from './gamification.service';

@ApiTags('Leaderboard')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  getLeaderboard(@Query('limit') limit?: string): Promise<any> {
    return this.gamificationService.getLeaderboard(limit ? parseInt(limit) : 50);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user gamification stats' })
  getUserStats(@CurrentUser() user: JwtPayload): Promise<any> {
    return this.gamificationService.getUserStats(user.sub);
  }
}
