import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';

@ApiTags('API Keys')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  create(@Body() dto: CreateApiKeyDto, @CurrentUser() user: JwtPayload) {
    return this.apiKeysService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all API keys for the current user' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.apiKeysService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an API key by id' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.apiKeysService.findOne(id, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke and delete an API key' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.apiKeysService.remove(id, user.sub);
  }
}
