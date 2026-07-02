import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { DocumentIntelligenceService } from './document-intelligence.service';
import { AnalyzeDocumentDto, ExtractDataDto, ClassifyDocumentDto, CompareDocumentsDto } from './dto/document-intelligence.dto';

@ApiTags('Document Intelligence')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('document-intelligence')
export class DocumentIntelligenceController {
  constructor(private readonly docIntelService: DocumentIntelligenceService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze a document (OCR, layout, tables, images)' })
  async analyzeDocument(@Body() dto: AnalyzeDocumentDto): Promise<any> {
    return this.docIntelService.analyzeDocument(dto.url, dto.type);
  }

  @Post('extract')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Extract structured data from a document' })
  async extractData(@Body() dto: ExtractDataDto): Promise<any> {
    return this.docIntelService.extractData(dto.url, dto.fields);
  }

  @Post('classify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Classify a document into categories' })
  async classifyDocument(@Body() dto: ClassifyDocumentDto): Promise<any> {
    return this.docIntelService.classifyDocument(dto.url, dto.categories);
  }

  @Post('compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Compare two documents and highlight differences' })
  async compareDocuments(@Body() dto: CompareDocumentsDto): Promise<any> {
    return this.docIntelService.compareDocuments(dto.sourceUrl, dto.targetUrl);
  }
}
