import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { MediaService } from './media.service';
import { GenerateThumbnailDto, ExecuteCodeDto } from './dto/media.dto';

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('thumbnails/generate')
  @ApiOperation({ summary: 'Generate a thumbnail' })
  generateThumbnail(@Body() dto: GenerateThumbnailDto, @CurrentUser() user: JwtPayload) {
    return this.mediaService.generateThumbnail(dto, user.sub);
  }

  @Get('thumbnails')
  @ApiOperation({ summary: 'List user thumbnails' })
  listThumbnails(@CurrentUser() user: JwtPayload) {
    return this.mediaService.listThumbnails(user.sub);
  }

  @Post('code/execute')
  @ApiOperation({ summary: 'Execute code in sandbox' })
  executeCode(@Body() dto: ExecuteCodeDto, @CurrentUser() user: JwtPayload) {
    return this.mediaService.executeCode(dto, user.sub);
  }

  @Get('code/executions')
  @ApiOperation({ summary: 'List code executions' })
  listExecutions(@CurrentUser() user: JwtPayload) {
    return this.mediaService.listExecutions(user.sub);
  }
}
