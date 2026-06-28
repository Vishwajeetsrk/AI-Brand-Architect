import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { PlannerService } from './planner.service';
import { CreateGoalDto, CreatePlanDto, UpdateTaskStatusDto, ReplanDto } from './dto/planner.dto';

@ApiTags('Planner')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Post('goals')
  @ApiOperation({ summary: 'Create a new goal' })
  createGoal(@Body() dto: CreateGoalDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.plannerService.createGoal(dto, user.sub);
  }

  @Get('goals')
  @ApiOperation({ summary: 'List all goals' })
  listGoals(@CurrentUser() user: JwtPayload): Promise<any> {
    return this.plannerService.listGoals(user.sub);
  }

  @Get('goals/:id')
  @ApiOperation({ summary: 'Get a goal by ID with tasks and sub-goals' })
  getGoal(@Param('id') id: string): Promise<any> {
    return this.plannerService.getGoal(id);
  }

  @Delete('goals/:id')
  @ApiOperation({ summary: 'Delete a goal' })
  deleteGoal(@Param('id') id: string): Promise<void> {
    return this.plannerService.deleteGoal(id);
  }

  @Post('goals/:id/subgoal')
  @ApiOperation({ summary: 'Create a sub-goal under a parent goal' })
  createSubGoal(@Param('id') parentId: string, @Body() dto: CreateGoalDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.plannerService.createGoal({ ...dto, parentGoalId: parentId }, user.sub);
  }

  @Post('goals/:id/plan')
  @ApiOperation({ summary: 'Create a plan from a goal' })
  createPlan(@Param('id') goalId: string, @Body() dto: CreatePlanDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.plannerService.createPlan(goalId, dto.capabilities, user.sub);
  }

  @Get('plans')
  @ApiOperation({ summary: 'List all plans' })
  listPlans(): Promise<any[]> {
    return this.plannerService.listPlans();
  }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Get a plan by ID' })
  getPlan(@Param('id') id: string): Promise<any> {
    return this.plannerService.getPlan(id);
  }

  @Get('plans/:id/tree')
  @ApiOperation({ summary: 'Get execution tree for a plan' })
  getExecutionTree(@Param('id') id: string): Promise<any> {
    return this.plannerService.getExecutionTree(id);
  }

  @Post('plans/:id/replan')
  @ApiOperation({ summary: 'Replan from a failed task' })
  replan(@Param('id') planId: string, @Body() dto: ReplanDto): Promise<any> {
    return this.plannerService.replan(planId, dto);
  }

  @Post('tasks/:id/status')
  @ApiOperation({ summary: 'Update task status' })
  updateTaskStatus(@Param('id') taskId: string, @Body() dto: UpdateTaskStatusDto): Promise<void> {
    return this.plannerService.updateTaskStatus(taskId, dto);
  }

  @Get('goals/:id/pending-tasks')
  @ApiOperation({ summary: 'Get pending tasks for a goal' })
  getPendingTasks(@Param('id') goalId: string): Promise<any[]> {
    return this.plannerService.getPendingTasks(goalId);
  }
}
