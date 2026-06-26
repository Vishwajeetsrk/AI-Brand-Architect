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
  getCategories(): any { return this.marketplaceService.getCategories(); }

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
  ): any {
    return this.marketplaceService.search({
      query, category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy as any,
    });
  }

  @Get('listings/featured')
  @ApiOperation({ summary: 'Get featured listings' })
  getFeatured(): any { return this.marketplaceService.getFeatured(); }

  @Get('listings/top-rated')
  @ApiOperation({ summary: 'Get top rated listings' })
  getTopRated(): any { return this.marketplaceService.getTopRated(); }

  @Get('listings/best-selling')
  @ApiOperation({ summary: 'Get best selling listings' })
  getBestSelling(): any { return this.marketplaceService.getBestSelling(); }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Get listing by ID' })
  getListing(@Param('id') id: string): any { return this.marketplaceService.getListing(id); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('listings')
  @ApiOperation({ summary: 'Publish a new listing' })
  createListing(@Body() data: any): any {
    return this.marketplaceService.createListing(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('listings/:id/purchase')
  @ApiOperation({ summary: 'Purchase a listing' })
  purchase(@Param('id') id: string, @Body() data: { userId: string }): any {
    return this.marketplaceService.purchase(id, data.userId);
  }

  @Get('listings/:id/reviews')
  @ApiOperation({ summary: 'Get reviews for a listing' })
  getReviews(@Param('id') id: string): any { return this.marketplaceService.getReviews(id); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('listings/:id/reviews')
  @ApiOperation({ summary: 'Add a review to a listing' })
  addReview(@Param('id') id: string, @Body() data: { userId: string; userName: string; rating: number; content: string }): any {
    return this.marketplaceService.addReview(id, data.userId, data.userName, data.rating, data.content);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('purchases')
  @ApiOperation({ summary: 'Get user purchases' })
  getUserPurchases(@Query('userId') userId: string): any {
    return this.marketplaceService.getUserPurchases(userId);
  }
}
