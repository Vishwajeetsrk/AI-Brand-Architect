import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';
import { CodeIntelligenceService } from './code-intelligence.service';
import { GenerateCodeDto, ReviewCodeDto, ExplainCodeDto, RefactorCodeDto } from './dto/code-intelligence.dto';

@ApiTags('Code Intelligence')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('code-intelligence')
export class CodeIntelligenceController {
  constructor(private readonly codeIntelligenceService: CodeIntelligenceService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate code from a natural language prompt' })
  async generateCode(@Body() dto: GenerateCodeDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.codeIntelligenceService.generateCode(dto.prompt, dto.language);
  }

  @Post('review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Review source code for issues and suggestions' })
  async reviewCode(@Body() dto: ReviewCodeDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.codeIntelligenceService.reviewCode(dto.code, dto.language);
  }

  @Post('explain')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Explain source code in natural language' })
  async explainCode(@Body() dto: ExplainCodeDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.codeIntelligenceService.explainCode(dto.code, dto.language);
  }

  @Post('refactor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refactor source code based on instructions' })
  async refactorCode(@Body() dto: RefactorCodeDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.codeIntelligenceService.refactorCode(dto.code, dto.instructions, dto.language);
  }
}
