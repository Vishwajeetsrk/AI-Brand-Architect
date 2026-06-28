import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CommerceService } from './commerce.service';

@ApiTags('Commerce / Billing')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('commerce')
export class CommerceController {
  constructor(private readonly commerce: CommerceService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all pricing plans' })
  getPlans(): any { return this.commerce.getPlans(); }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Get plan by ID' })
  getPlan(@Param('id') id: string): any { return this.commerce.getPlan(id); }

  @Post('plans')
  @ApiOperation({ summary: 'Create a custom plan' })
  createPlan(@Body() data: any): any { return this.commerce.createPlan(data); }

  @Put('plans/:id')
  @ApiOperation({ summary: 'Update a plan' })
  updatePlan(@Param('id') id: string, @Body() data: any): any { return this.commerce.updatePlan(id, data); }

  @Get('wallet/:userId')
  @ApiOperation({ summary: 'Get wallet balance' })
  getWallet(@Param('userId') userId: string): any { return this.commerce.getWallet(userId); }

  @Get('wallet/:userId/transactions')
  @ApiOperation({ summary: 'Get wallet transaction history' })
  getWalletTransactions(@Param('userId') userId: string, @Query('limit') limit?: string, @Query('offset') offset?: string): any {
    return this.commerce.getWalletTransactions(userId, Number(limit) || 50, Number(offset) || 0);
  }

  @Post('wallet/:userId/add')
  @ApiOperation({ summary: 'Add funds to wallet' })
  addFunds(@Param('userId') userId: string, @Body() data: { amount: number; reason: string; referenceType?: string; referenceId?: string }): any {
    return this.commerce.addFunds(userId, data.amount, data.reason, data.referenceType, data.referenceId);
  }

  @Post('wallet/:userId/deduct')
  @ApiOperation({ summary: 'Deduct funds from wallet' })
  deductFunds(@Param('userId') userId: string, @Body() data: { amount: number; reason: string; referenceType?: string; referenceId?: string }): any {
    return this.commerce.deductFunds(userId, data.amount, data.reason, data.referenceType, data.referenceId);
  }

  @Post('wallet/transfer')
  @ApiOperation({ summary: 'Transfer funds between users' })
  transferFunds(@Body() data: { fromUserId: string; toUserId: string; amount: number }): any {
    return this.commerce.transferFunds(data.fromUserId, data.toUserId, data.amount);
  }

  @Post('subscriptions')
  @ApiOperation({ summary: 'Create subscription for a user' })
  createSubscription(@Body() data: { userId: string; planId: string; billingCycle?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' }): any {
    return this.commerce.createSubscription(data.userId, data.planId, data.billingCycle);
  }

  @Get('subscriptions/:userId')
  @ApiOperation({ summary: 'Get user current subscription' })
  getUserSubscription(@Param('userId') userId: string): any { return this.commerce.getUserSubscription(userId); }

  @Post('subscriptions/:id/cancel')
  @ApiOperation({ summary: 'Cancel subscription' })
  cancelSubscription(@Param('id') id: string): any { return this.commerce.cancelSubscription(id); }

  @Post('subscriptions/:id/change-plan')
  @ApiOperation({ summary: 'Change subscription plan' })
  changePlan(@Param('id') id: string, @Body() data: { planId: string }): any {
    return this.commerce.changePlan(id, data.planId);
  }

  @Post('subscriptions/:id/renew')
  @ApiOperation({ summary: 'Renew subscription (creates invoice)' })
  renewSubscription(@Param('id') id: string): any { return this.commerce.renewSubscription(id); }

  @Get('invoices/:subscriptionId')
  @ApiOperation({ summary: 'Get invoices for a subscription' })
  getInvoices(@Param('subscriptionId') subscriptionId: string): any { return this.commerce.getInvoices(subscriptionId); }

  @Get('invoices/org/:organizationId')
  @ApiOperation({ summary: 'Get invoices for an organization' })
  getInvoicesForOrg(@Param('organizationId') organizationId: string): any { return this.commerce.getInvoicesForOrg(organizationId); }

  @Post('invoices/generate')
  @ApiOperation({ summary: 'Generate a new invoice' })
  generateInvoice(@Body() data: { organizationId: string; subscriptionId: string; planId: string; couponCode?: string }): any {
    return this.commerce.getPlan(data.planId).then((plan: any) =>
      this.commerce.generateInvoice(data.organizationId, data.subscriptionId, plan, data.couponCode)
    );
  }

  @Post('invoices/:id/pay')
  @ApiOperation({ summary: 'Mark invoice as paid' })
  payInvoice(@Param('id') id: string): any { return this.commerce.payInvoice(id); }

  @Get('coupons')
  @ApiOperation({ summary: 'Get all coupons' })
  getCoupons(): any { return this.commerce.getCoupons(); }

  @Post('coupons')
  @ApiOperation({ summary: 'Create a coupon' })
  createCoupon(@Body() data: any): any { return this.commerce.createCoupon(data); }

  @Post('coupons/validate')
  @ApiOperation({ summary: 'Validate a coupon code' })
  validateCoupon(@Body() data: { code: string; planId?: string }): any {
    return this.commerce.validateCoupon(data.code, data.planId);
  }

  @Get('usage/:userId')
  @ApiOperation({ summary: 'Get usage records for a user' })
  getUsage(@Param('userId') userId: string, @Query('period') period?: string): any {
    return this.commerce.getUsage(userId, period);
  }

  @Get('usage/org/:organizationId')
  @ApiOperation({ summary: 'Get usage records for an organization' })
  getOrgUsage(@Param('organizationId') organizationId: string, @Query('period') period?: string): any {
    return this.commerce.getOrgUsage(organizationId, period);
  }

  @Post('usage/record')
  @ApiOperation({ summary: 'Record a usage metric' })
  recordUsage(@Body() data: { userId: string; metric: string; value: number; unit: string; organizationId?: string; metadata?: any }): any {
    return this.commerce.recordUsage(data.userId, data.metric, data.value, data.unit, data.organizationId, data.metadata);
  }

  @Get('limits/:userId')
  @ApiOperation({ summary: 'Check plan limits for a user' })
  checkLimits(@Param('userId') userId: string): any { return this.commerce.checkLimits(userId); }

  @Get('analytics')
  @ApiOperation({ summary: 'Get billing analytics (MRR, ARR, active subs, etc.)' })
  getAnalytics(): any { return this.commerce.getAnalytics(); }

  @Get('revenue-share/:creatorId')
  @ApiOperation({ summary: 'Get revenue share for a creator' })
  getRevenueShare(@Param('creatorId') creatorId: string, @Query('period') period?: string): any {
    return this.commerce.getRevenueShare(creatorId, period);
  }
}
