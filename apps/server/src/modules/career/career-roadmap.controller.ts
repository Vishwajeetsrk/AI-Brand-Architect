import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { CareerRoadmapService } from './career-roadmap.service';
import { CreateCareerRoadmapDto } from './dto/career-roadmap.dto';

@ApiTags('Career Roadmap')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('career/roadmaps')
export class CareerRoadmapController {
  constructor(private readonly roadmapService: CareerRoadmapService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a career roadmap' })
  generate(@Body() dto: CreateCareerRoadmapDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.roadmapService.generate(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List user career roadmaps' })
  list(@CurrentUser() user: JwtPayload): Promise<any> {
    return this.roadmapService.list(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get career roadmap by ID' })
  get(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.roadmapService.get(id, user.sub);
  }
}
