import { Controller, Post, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { CoachingService } from './coaching.service';
import { CreateSessionDto } from './dto/coaching.dto';

@ApiTags('Coaching')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('coaching')
export class CoachingController {
  constructor(private readonly coachingService: CoachingService) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Create a coaching session' })
  create(@Body() dto: CreateSessionDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.coachingService.create(dto, user.sub);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'List user coaching sessions' })
  list(@CurrentUser() user: JwtPayload): Promise<any> {
    return this.coachingService.list(user.sub);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get session by ID' })
  get(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.coachingService.get(id, user.sub);
  }

  @Put('sessions/:id/status')
  @ApiOperation({ summary: 'Update session status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.coachingService.updateStatus(id, user.sub, status);
  }

  @Post('sessions/:id/feedback')
  @ApiOperation({ summary: 'Submit session feedback' })
  addFeedback(@Param('id') id: string, @Body('feedback') feedback: string, @Body('rating') rating: number, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.coachingService.addFeedback(id, user.sub, feedback, rating);
  }
}
