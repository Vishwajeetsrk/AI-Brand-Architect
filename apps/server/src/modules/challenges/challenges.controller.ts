import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto, SubmitSolutionDto } from './dto/challenges.dto';

@ApiTags('Challenges')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: 'List challenges with filters' })
  list(@Query('language') language?: string, @Query('difficulty') difficulty?: string, @Query('topic') topic?: string): Promise<any> {
    return this.challengesService.list({ language, difficulty, topic });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get challenge by ID' })
  get(@Param('id') id: string): Promise<any> {
    return this.challengesService.get(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a challenge' })
  create(@Body() dto: CreateChallengeDto): Promise<any> {
    return this.challengesService.create(dto);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit solution for a challenge' })
  submit(@Body() dto: SubmitSolutionDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.challengesService.submit(dto, user.sub);
  }

  @Get('submissions/mine')
  @ApiOperation({ summary: 'Get user submissions' })
  getSubmissions(@CurrentUser() user: JwtPayload): Promise<any> {
    return this.challengesService.getSubmissions(user.sub);
  }
}
