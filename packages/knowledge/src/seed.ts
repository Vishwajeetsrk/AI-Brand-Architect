import { knowledgeBase } from './knowledge-base';

function seedKnowledge() {
  console.log('Seeding knowledge base...');

  const articles = [
    {
      title: 'Crafting Your Brand Voice',
      content: 'A strong brand voice differentiates you from competitors and builds trust with your audience. Start by defining your brand personality traits, then create a voice chart that maps out do\'s and don\'ts for every channel.',
      summary: 'Learn how to define and maintain a consistent brand voice across all channels.',
      category: 'cat-1',
      tags: ['brand voice', 'tone', 'messaging', 'brand identity'],
      authorId: 'author-1',
      status: 'published' as const,
    },
    {
      title: 'Color Theory for Brands',
      content: 'Colors evoke emotions and influence purchasing decisions. Learn how to choose a primary palette, secondary accents, and how to ensure accessibility with proper contrast ratios across digital and print materials.',
      summary: 'A comprehensive guide to selecting and applying color palettes for brand identity.',
      category: 'cat-2',
      tags: ['color theory', 'palette', 'design', 'accessibility'],
      authorId: 'author-1',
      status: 'published' as const,
    },
    {
      title: 'Content Marketing Strategy Framework',
      content: 'Build a content marketing strategy that drives engagement and conversions. This framework covers audience research, content pillars, distribution channels, and KPI tracking to measure success.',
      summary: 'A step-by-step framework for building an effective content marketing strategy.',
      category: 'cat-3',
      tags: ['content marketing', 'strategy', 'SEO', 'engagement'],
      authorId: 'author-2',
      status: 'published' as const,
    },
    {
      title: '2025 Industry Trends Analysis',
      content: 'Our analysis of the top trends shaping brand strategy in 2025, including AI-driven personalization, sustainable branding, immersive experiences, and the rise of community-led growth.',
      summary: 'Analysis of the top trends shaping brand strategy this year.',
      category: 'cat-4',
      tags: ['trends', 'industry analysis', 'AI', 'sustainability'],
      authorId: 'author-1',
      status: 'published' as const,
    },
    {
      title: 'A/B Testing Best Practices',
      content: 'Master A/B testing to optimize your brand campaigns. Learn about statistical significance, sample sizes, testing duration, and how to avoid common pitfalls that lead to false conclusions.',
      summary: 'Best practices for running effective A/B tests on brand campaigns.',
      category: 'cat-5',
      tags: ['A/B testing', 'optimization', 'conversion', 'experimentation'],
      authorId: 'author-2',
      status: 'draft' as const,
    },
  ];

  for (const article of articles) {
    const created = knowledgeBase.createArticle(article);
    console.log(`Created article: "${created.title}" (${created.id})`);
  }

  console.log(`Total articles: ${knowledgeBase.getArticles().length}`);
  console.log(`Total categories: ${knowledgeBase.getCategories().length}`);

  const results = knowledgeBase.search('brand voice');
  console.log(`Search results for "brand voice": ${results.length}`);

  console.log('Knowledge seed complete.');
}

seedKnowledge();
