import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { ExecuteAgentDto } from './dto/execute-agent.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Agents')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AI agent' })
  create(@Body() dto: CreateAgentDto, @CurrentUser() user: JwtPayload) {
    return this.agentsService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an agent by id' })
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agent' })
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute an agent with input data' })
  execute(@Param('id') id: string, @Body() dto: ExecuteAgentDto) {
    return this.agentsService.execute(id, dto);
  }
}
