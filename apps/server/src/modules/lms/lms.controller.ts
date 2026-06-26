import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LmsService } from './lms.service';

@ApiTags('LMS')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('lms')
export class LmsController {
  constructor(private readonly lmsService: LmsService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Get published courses' })
  getCourses(@Query('category') category?: string, @Query('level') level?: string) {
    return this.lmsService.getCourses(category, level);
  }

  @Get('courses/:id')
  @ApiOperation({ summary: 'Get course detail' })
  getCourse(@Param('id') id: string) {
    return this.lmsService.getCourse(id);
  }

  @Post('courses')
  @ApiOperation({ summary: 'Create a course' })
  createCourse(@Body() data: any) {
    return this.lmsService.createCourse(data);
  }

  @Get('courses/:id/modules')
  @ApiOperation({ summary: 'Get course modules with lessons' })
  getModules(@Param('id') id: string) {
    return this.lmsService.getModules(id);
  }

  @Post('courses/:id/enroll')
  @ApiOperation({ summary: 'Enroll in a course' })
  enroll(@Param('id') id: string, @Body('userId') userId: string) {
    return this.lmsService.enroll(id, userId);
  }

  @Get('enrollments')
  @ApiOperation({ summary: 'Get my enrollments' })
  getEnrollments(@Query('userId') userId: string) {
    return this.lmsService.getEnrollments(userId);
  }

  @Post('lessons/:id/complete')
  @ApiOperation({ summary: 'Mark lesson as complete' })
  completeLesson(@Param('id') id: string, @Body('userId') userId: string) {
    return this.lmsService.completeLesson(id, userId);
  }

  @Get('lessons/:id/quiz')
  @ApiOperation({ summary: 'Get quiz for a lesson' })
  getQuiz(@Param('id') id: string) {
    return this.lmsService.getQuiz(id);
  }

  @Post('quizzes/:id/submit')
  @ApiOperation({ summary: 'Submit quiz answers' })
  submitQuiz(@Param('id') id: string, @Body() submission: any) {
    return this.lmsService.submitQuiz({ ...submission, quizId: id });
  }

  @Get('certificates')
  @ApiOperation({ summary: 'Get user certificates' })
  getCertificates(@Query('userId') userId: string) {
    return this.lmsService.getCertificates(userId);
  }

  @Get('learning-paths')
  @ApiOperation({ summary: 'Get learning paths' })
  getLearningPaths() {
    return this.lmsService.getLearningPaths();
  }
}
