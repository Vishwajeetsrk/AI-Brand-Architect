import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { CareerService } from './career.service';
import { CreateResumeDto, CreateJobDto, CreateInterviewDto, ApplyJobDto, SaveAnswerDto, CreateSkillAssessmentDto, CreatePortfolioDto } from './dto/career.dto';

@ApiTags('Career')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Post('resumes')
  @ApiOperation({ summary: 'Create a resume' })
  createResume(@Body() dto: CreateResumeDto, @CurrentUser() user: JwtPayload) { return this.careerService.createResume(dto, user.sub); }

  @Get('resumes')
  @ApiOperation({ summary: 'List user resumes' })
  listResumes(@CurrentUser() user: JwtPayload) { return this.careerService.listResumes(user.sub); }

  @Get('resumes/:id')
  @ApiOperation({ summary: 'Get resume by ID' })
  getResume(@Param('id') id: string, @CurrentUser() user: JwtPayload) { return this.careerService.getResume(id, user.sub); }

  @Put('resumes/:id')
  @ApiOperation({ summary: 'Update resume' })
  updateResume(@Param('id') id: string, @Body() dto: CreateResumeDto, @CurrentUser() user: JwtPayload) { return this.careerService.updateResume(id, dto, user.sub); }

  @Delete('resumes/:id')
  @ApiOperation({ summary: 'Delete resume' })
  deleteResume(@Param('id') id: string, @CurrentUser() user: JwtPayload) { return this.careerService.deleteResume(id, user.sub); }

  @Post('jobs')
  @ApiOperation({ summary: 'Create a job listing' })
  createJob(@Body() dto: CreateJobDto, @CurrentUser() user: JwtPayload) { return this.careerService.createJob(dto, user.sub); }

  @Get('jobs')
  @ApiOperation({ summary: 'List jobs with filters' })
  listJobs(@Query() q: any) { return this.careerService.listJobs(q); }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get job by ID' })
  getJob(@Param('id') id: string) { return this.careerService.getJob(id); }

  @Post('jobs/:id/apply')
  @ApiOperation({ summary: 'Apply to a job' })
  applyToJob(@Param('id') id: string, @Body() dto: ApplyJobDto, @CurrentUser() user: JwtPayload) { return this.careerService.applyToJob(id, dto, user.sub); }

  @Get('applications')
  @ApiOperation({ summary: 'List user applications' })
  listApplications(@CurrentUser() user: JwtPayload, @Query('jobId') jobId?: string) { return this.careerService.listApplications(user.sub, jobId); }

  @Post('interviews')
  @ApiOperation({ summary: 'Create mock interview' })
  createInterview(@Body() dto: CreateInterviewDto, @CurrentUser() user: JwtPayload) { return this.careerService.createInterview(dto, user.sub); }

  @Get('interviews')
  @ApiOperation({ summary: 'List user interviews' })
  listInterviews(@CurrentUser() user: JwtPayload) { return this.careerService.listInterviews(user.sub); }

  @Get('interviews/:id')
  @ApiOperation({ summary: 'Get interview details' })
  getInterview(@Param('id') id: string, @CurrentUser() user: JwtPayload) { return this.careerService.getInterview(id, user.sub); }

  @Post('interviews/:id/questions/:questionId/answer')
  @ApiOperation({ summary: 'Save answer for interview question' })
  saveAnswer(@Param('id') id: string, @Param('questionId') questionId: string, @Body() dto: SaveAnswerDto, @CurrentUser() user: JwtPayload) { return this.careerService.saveAnswer(questionId, dto, user.sub); }

  @Post('interviews/:id/complete')
  @ApiOperation({ summary: 'Complete interview and get score' })
  completeInterview(@Param('id') id: string, @CurrentUser() user: JwtPayload) { return this.careerService.completeInterview(id, user.sub); }

  @Post('skill-assessments')
  @ApiOperation({ summary: 'Create skill assessment' })
  createSkillAssessment(@Body() dto: CreateSkillAssessmentDto, @CurrentUser() user: JwtPayload) { return this.careerService.createSkillAssessment(dto, user.sub); }

  @Get('skill-assessments')
  @ApiOperation({ summary: 'List skill assessments' })
  listSkillAssessments(@CurrentUser() user: JwtPayload) { return this.careerService.listSkillAssessments(user.sub); }

  @Post('portfolios')
  @ApiOperation({ summary: 'Create portfolio' })
  createPortfolio(@Body() dto: CreatePortfolioDto, @CurrentUser() user: JwtPayload) { return this.careerService.createPortfolio(dto, user.sub); }

  @Get('portfolios/me')
  @ApiOperation({ summary: 'Get current user portfolio' })
  getMyPortfolio(@CurrentUser() user: JwtPayload) { return this.careerService.getPortfolio(user.sub); }

  @Put('portfolios/:id')
  @ApiOperation({ summary: 'Update portfolio' })
  updatePortfolio(@Param('id') id: string, @Body() dto: CreatePortfolioDto, @CurrentUser() user: JwtPayload) { return this.careerService.updatePortfolio(id, dto, user.sub); }

  @Post('portfolios/:id/projects')
  @ApiOperation({ summary: 'Add project to portfolio' })
  addProject(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: JwtPayload) { return this.careerService.addPortfolioProject(id, dto, user.sub); }

  @Get('ats-score')
  @ApiOperation({ summary: 'Get ATS score for resume against job' })
  getATSScore(@Query('resumeId') resumeId: string, @Query('jobId') jobId: string, @CurrentUser() user: JwtPayload) { return this.careerService.getATSScore(resumeId, jobId, user.sub); }
}
