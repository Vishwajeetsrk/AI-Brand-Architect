import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteMemberDto, MemberRole } from './dto/invite-member.dto';

export interface OrganizationMember {
  userId: string;
  email: string;
  role: MemberRole;
  joinedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  industry: string | null;
  ownerId: string;
  members: OrganizationMember[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class OrganizationsService {
  private organizations: Organization[] = [];

  create(dto: CreateOrganizationDto, userId: string, email: string): Organization {
    const org: Organization = {
      id: uuidv4(),
      name: dto.name,
      description: dto.description || null,
      website: dto.website || null,
      industry: dto.industry || null,
      ownerId: userId,
      members: [
        { userId, email, role: MemberRole.ADMIN, joinedAt: new Date() },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.organizations.push(org);
    return org;
  }

  findAll(userId?: string): Organization[] {
    if (!userId) return this.organizations;
    return this.organizations.filter(
      (o) => o.ownerId === userId || o.members.some((m) => m.userId === userId),
    );
  }

  findOne(id: string): Organization {
    const org = this.organizations.find((o) => o.id === id);
    if (!org) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
    return org;
  }

  update(id: string, dto: Partial<CreateOrganizationDto>, userId: string): Organization {
    const org = this.findOne(id);
    if (org.ownerId !== userId) {
      throw new ForbiddenException('Only the organization owner can update it');
    }

    if (dto.name !== undefined) org.name = dto.name;
    if (dto.description !== undefined) org.description = dto.description;
    if (dto.website !== undefined) org.website = dto.website;
    if (dto.industry !== undefined) org.industry = dto.industry;
    org.updatedAt = new Date();

    const index = this.organizations.findIndex((o) => o.id === id);
    this.organizations[index] = org;
    return org;
  }

  remove(id: string, userId: string): void {
    const org = this.findOne(id);
    if (org.ownerId !== userId) {
      throw new ForbiddenException('Only the organization owner can delete it');
    }
    const index = this.organizations.findIndex((o) => o.id === id);
    this.organizations.splice(index, 1);
  }

  addMember(id: string, dto: InviteMemberDto, userId: string): Organization {
    const org = this.findOne(id);
    const member = org.members.find((m) => m.userId === userId);
    if (!member || member.role !== MemberRole.ADMIN) {
      throw new ForbiddenException('Only admins can invite members');
    }

    if (org.members.some((m) => m.email === dto.email)) {
      throw new ConflictException('User is already a member of this organization');
    }

    org.members.push({
      userId: uuidv4(),
      email: dto.email,
      role: dto.role,
      joinedAt: new Date(),
    });
    org.updatedAt = new Date();

    const index = this.organizations.findIndex((o) => o.id === id);
    this.organizations[index] = org;
    return org;
  }

  removeMember(id: string, memberUserId: string, userId: string): Organization {
    const org = this.findOne(id);
    const member = org.members.find((m) => m.userId === userId);
    if (!member || member.role !== MemberRole.ADMIN) {
      throw new ForbiddenException('Only admins can remove members');
    }

    const memberIndex = org.members.findIndex((m) => m.userId === memberUserId);
    if (memberIndex === -1) {
      throw new NotFoundException('Member not found');
    }
    org.members.splice(memberIndex, 1);
    org.updatedAt = new Date();

    const index = this.organizations.findIndex((o) => o.id === id);
    this.organizations[index] = org;
    return org;
  }
}
