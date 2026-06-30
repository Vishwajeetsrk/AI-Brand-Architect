import { Controller, Post, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { ShowcaseService } from './showcase.service';
import { CreateShowcaseProjectDto, CreateShowcaseCommentDto } from './dto/showcase.dto';

@ApiTags('Showcase')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a showcase project' })
  create(@Body() dto: CreateShowcaseProjectDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.showcaseService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List public showcase projects' })
  listPublic(): Promise<any> {
    return this.showcaseService.listPublic();
  }

  @Get('mine')
  @ApiOperation({ summary: 'List user showcase projects' })
  listUser(@CurrentUser() user: JwtPayload): Promise<any> {
    return this.showcaseService.listUser(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get showcase project' })
  get(@Param('id') id: string): Promise<any> {
    return this.showcaseService.get(id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like a showcase project' })
  like(@Param('id') id: string): Promise<any> {
    return this.showcaseService.like(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to showcase project' })
  addComment(@Param('id') id: string, @Body() dto: CreateShowcaseCommentDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.showcaseService.addComment(id, user.sub, dto.content);
  }
}
