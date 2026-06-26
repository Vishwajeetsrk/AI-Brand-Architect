import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { MarketplaceService } from './marketplace.service';

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all listing categories' })
  getCategories() { return this.marketplaceService.getCategories(); }

  @Get('listings')
  @ApiOperation({ summary: 'Search marketplace listings' })
  search(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minRating') minRating?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.marketplaceService.search({
      query, category, type: type as any,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy: sortBy as any, sortOrder: sortOrder as any,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('listings/featured')
  @ApiOperation({ summary: 'Get featured listings' })
  getFeatured() { return this.marketplaceService.getFeatured(); }

  @Get('listings/top-rated')
  @ApiOperation({ summary: 'Get top rated listings' })
  getTopRated() { return this.marketplaceService.getTopRated(); }

  @Get('listings/best-selling')
  @ApiOperation({ summary: 'Get best selling listings' })
  getBestSelling() { return this.marketplaceService.getBestSelling(); }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Get listing by ID' })
  getListing(@Param('id') id: string) { return this.marketplaceService.getListing(id); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('listings')
  @ApiOperation({ summary: 'Publish a new listing' })
  createListing(@Body() data: any) {
    return this.marketplaceService.createListing(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('listings/:id/purchase')
  @ApiOperation({ summary: 'Purchase a listing' })
  purchase(@Param('id') id: string, @Body() data: { userId: string }) {
    return this.marketplaceService.purchase(id, data.userId);
  }

  @Get('listings/:id/reviews')
  @ApiOperation({ summary: 'Get reviews for a listing' })
  getReviews(@Param('id') id: string) { return this.marketplaceService.getReviews(id); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('listings/:id/reviews')
  @ApiOperation({ summary: 'Add a review to a listing' })
  addReview(@Param('id') id: string, @Body() data: { userId: string; userName: string; rating: number; content: string }) {
    return this.marketplaceService.addReview(id, data.userId, data.userName, data.rating, data.content);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('purchases')
  @ApiOperation({ summary: 'Get user purchases' })
  getUserPurchases(@Query('userId') userId: string) {
    return this.marketplaceService.getUserPurchases(userId);
  }
}
