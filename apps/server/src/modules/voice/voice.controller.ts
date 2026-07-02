import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { VoiceService } from './voice.service';
import { SynthesizeDto, TranscribeDto, CloneVoiceDto } from './dto/voice.dto';

@ApiTags('Voice')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('synthesize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Synthesize text to speech' })
  async synthesize(@Body() dto: SynthesizeDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.voiceService.synthesize(dto.text, dto.voice);
  }

  @Post('transcribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transcribe speech to text' })
  async transcribe(@Body() dto: TranscribeDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.voiceService.transcribe(dto.audioUrl);
  }

  @Post('clone')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Clone a voice from audio samples' })
  async cloneVoice(@Body() dto: CloneVoiceDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.voiceService.cloneVoice(dto.name, dto.audioUrls);
  }
}
