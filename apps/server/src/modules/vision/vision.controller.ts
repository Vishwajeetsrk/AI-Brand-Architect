import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { VisionService } from './vision.service';
import { AnalyzeImageDto, GenerateImageDto } from './dto/vision.dto';

@ApiTags('Vision')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('vision')
export class VisionController {
  constructor(private readonly visionService: VisionService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze an image and return description and labels' })
  async analyzeImage(@Body() dto: AnalyzeImageDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.visionService.analyzeImage(dto.imageUrl);
  }

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate an image from a text prompt' })
  async generateImage(@Body() dto: GenerateImageDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.visionService.generateImage(dto.prompt, dto.style);
  }
}
