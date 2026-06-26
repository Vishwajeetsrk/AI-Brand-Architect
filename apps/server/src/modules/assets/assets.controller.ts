import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new asset record' })
  create(@Body() dto: CreateAssetDto, @CurrentUser() user: JwtPayload) {
    return this.assetsService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'brandId', required: false })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('projectId') projectId?: string,
    @Query('brandId') brandId?: string,
  ) {
    return this.assetsService.findAll(user.sub, projectId, brandId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an asset by id' })
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  remove(@Param('id') id: string) {
    return this.assetsService.remove(id);
  }
}
