import { DocumentIntelligenceService } from './document-intelligence.service';

describe('DocumentIntelligenceService', () => {
  let service: DocumentIntelligenceService;

  beforeEach(() => {
    service = new DocumentIntelligenceService();
  });

  describe('analyzeDocument', () => {
    it('should analyze a document and return metadata', async () => {
      const result = await service.analyzeDocument('https://example.com/doc.pdf');

      expect(result).toHaveProperty('url', 'https://example.com/doc.pdf');
      expect(result).toHaveProperty('type', 'pdf');
      expect(result).toHaveProperty('pages');
      expect(result).toHaveProperty('textContent');
      expect(result).toHaveProperty('tables');
      expect(result).toHaveProperty('images');
      expect(result).toHaveProperty('metadata');
      expect(result).toHaveProperty('ocrConfidence');
      expect(result).toHaveProperty('analyzedAt');

      expect(typeof result.pages).toBe('number');
      expect(result.pages).toBeGreaterThan(0);
      expect(Array.isArray(result.tables)).toBe(true);
      expect(result.metadata).toHaveProperty('author');
      expect(result.metadata).toHaveProperty('createdAt');
      expect(result.metadata).toHaveProperty('fileSize');
      expect(result.metadata).toHaveProperty('pageCount');
    });

    it('should accept optional type parameter', async () => {
      const result = await service.analyzeDocument('https://example.com/doc.docx', 'docx');
      expect(result).toHaveProperty('type', 'docx');
    });
  });

  describe('extractData', () => {
    it('should extract specified fields from a document', async () => {
      const result = await service.extractData('https://example.com/invoice.pdf', ['date', 'total', 'vendor']);

      expect(result).toHaveProperty('url', 'https://example.com/invoice.pdf');
      expect(result).toHaveProperty('extracted');
      expect(result).toHaveProperty('confidence');

      expect(result.extracted).toHaveProperty('date');
      expect(result.extracted).toHaveProperty('total');
      expect(result.extracted).toHaveProperty('vendor');
      expect(result.extracted.date).toContain('Extracted date:');
    });

    it('should extract default fields when none specified', async () => {
      const result = await service.extractData('https://example.com/invoice.pdf');

      expect(result.extracted).toHaveProperty('invoiceNumber');
      expect(result.extracted).toHaveProperty('date');
      expect(result.extracted).toHaveProperty('total');
      expect(result.extracted).toHaveProperty('vendor');
      expect(result.extracted.vendor).toBe('Sample Vendor Inc.');
    });
  });

  describe('classifyDocument', () => {
    it('should classify a document into categories', async () => {
      const result = await service.classifyDocument('https://example.com/doc.pdf');

      expect(result).toHaveProperty('url', 'https://example.com/doc.pdf');
      expect(result).toHaveProperty('primaryCategory');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('allCategories');

      expect(typeof result.primaryCategory).toBe('string');
      expect(Array.isArray(result.allCategories)).toBe(true);
      expect(result.allCategories.length).toBeLessThanOrEqual(3);
    });

    it('should classify against provided categories', async () => {
      const categories = ['invoice', 'contract'];
      const result = await service.classifyDocument('https://example.com/doc.pdf', categories);

      expect(categories).toContain(result.primaryCategory);
      expect(result.allCategories.length).toBeLessThanOrEqual(3);
      expect(result.allCategories[0]).toHaveProperty('category');
      expect(result.allCategories[0]).toHaveProperty('confidence');
    });
  });

  describe('compareDocuments', () => {
    it('should compare two documents', async () => {
      const result = await service.compareDocuments('https://example.com/doc-v1.pdf', 'https://example.com/doc-v2.pdf');

      expect(result).toHaveProperty('sourceUrl', 'https://example.com/doc-v1.pdf');
      expect(result).toHaveProperty('targetUrl', 'https://example.com/doc-v2.pdf');
      expect(result).toHaveProperty('similarityScore');
      expect(result).toHaveProperty('differences');
      expect(result).toHaveProperty('summary');

      expect(Array.isArray(result.differences)).toBe(true);
      expect(result.differences.length).toBeGreaterThan(0);
      for (const diff of result.differences) {
        expect(diff).toHaveProperty('section');
        expect(diff).toHaveProperty('status');
        expect(diff).toHaveProperty('details');
      }
      expect(result.summary).toContain('similar');
    });
  });
});
