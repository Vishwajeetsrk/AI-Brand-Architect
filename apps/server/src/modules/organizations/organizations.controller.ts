import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  create(@Body() dto: CreateOrganizationDto, @CurrentUser() user: JwtPayload) {
    return this.organizationsService.create(dto, user.sub, user.email);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations for the current user' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.organizationsService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by id' })
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization' })
  update(@Param('id') id: string, @Body() dto: CreateOrganizationDto, @CurrentUser() user: JwtPayload) {
    return this.organizationsService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.organizationsService.remove(id, user.sub);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Invite a member to the organization' })
  addMember(@Param('id') id: string, @Body() dto: InviteMemberDto, @CurrentUser() user: JwtPayload) {
    return this.organizationsService.addMember(id, dto, user.sub);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from the organization' })
  removeMember(@Param('id') id: string, @Param('memberId') memberId: string, @CurrentUser() user: JwtPayload) {
    return this.organizationsService.removeMember(id, memberId, user.sub);
  }
}
