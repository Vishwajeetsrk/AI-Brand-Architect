import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Brands')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  create(@Body() dto: CreateBrandDto, @CurrentUser() user: JwtPayload) {
    return this.brandsService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiQuery({ name: 'search', required: false })
  findAll(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    return this.brandsService.findAll(user.sub, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a brand by id' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a brand' })
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a brand' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
