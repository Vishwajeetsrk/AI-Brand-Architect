import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CommerceService } from './commerce.service';

@ApiTags('Commerce')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('commerce')
export class CommerceController {
  constructor(private readonly commerceService: CommerceService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all pricing plans' })
  getPlans() { return this.commerceService.getPlans(); }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Get plan by ID' })
  getPlan(@Param('id') id: string) { return this.commerceService.getPlan(id); }

  @Post('subscriptions')
  @ApiOperation({ summary: 'Create subscription' })
  createSubscription(@Body() data: { userId: string; planId: string }) {
    return this.commerceService.createSubscription(data.userId, data.planId);
  }

  @Get('subscriptions/:userId')
  @ApiOperation({ summary: 'Get user subscription' })
  getSubscription(@Param('userId') userId: string) { return this.commerceService.getSubscription(userId); }

  @Post('subscriptions/:id/cancel')
  @ApiOperation({ summary: 'Cancel subscription' })
  cancelSubscription(@Param('id') id: string) { return this.commerceService.cancelSubscription(id); }

  @Post('subscriptions/:id/change-plan')
  @ApiOperation({ summary: 'Change subscription plan' })
  changePlan(@Param('id') id: string, @Body() data: { planId: string }) {
    return this.commerceService.changePlan(id, data.planId);
  }

  @Get('invoices/:subscriptionId')
  @ApiOperation({ summary: 'Get subscription invoices' })
  getInvoices(@Param('subscriptionId') subscriptionId: string) { return this.commerceService.getInvoices(subscriptionId); }

  @Get('usage/:userId')
  @ApiOperation({ summary: 'Get usage records' })
  getUsage(@Param('userId') userId: string, @Query('period') period?: string) { return this.commerceService.getUsage(userId, period); }

  @Get('limits/:userId')
  @ApiOperation({ summary: 'Check usage limits' })
  checkLimits(@Param('userId') userId: string) { return this.commerceService.checkLimits(userId); }
}
