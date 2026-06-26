import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteMemberDto, MemberRole } from './dto/invite-member.dto';

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
}

const memberRoleMap: Record<string, string> = {
  [MemberRole.ADMIN]: 'ADMIN',
  [MemberRole.EDITOR]: 'MEMBER',
  [MemberRole.VIEWER]: 'VIEWER',
};

const orgInclude = {
  members: {
    include: { user: { select: { id: true, email: true } } },
  },
} as const;

@Injectable()
export class OrganizationsService {
  async create(dto: CreateOrganizationDto, userId: string, email: string) {
    const org = await prisma.organization.create({
      data: {
        name: dto.name,
        slug: slugify(dto.name),
        description: dto.description || null,
        website: dto.website || null,
        industry: dto.industry || null,
        members: {
          create: { userId, role: 'OWNER' },
        },
      },
      include: orgInclude,
    });
    return this.formatOrg(org);
  }

  async findAll(userId?: string) {
    const where = userId ? { members: { some: { userId } } } : {};
    const orgs = await prisma.organization.findMany({ where, include: orgInclude });
    return orgs.map((o) => this.formatOrg(o));
  }

  async findOne(id: string) {
    const org = await prisma.organization.findUnique({ where: { id }, include: orgInclude });
    if (!org) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
    return this.formatOrg(org);
  }

  async update(id: string, dto: Partial<CreateOrganizationDto>, userId: string) {
    const org = await prisma.organization.findUnique({ where: { id }, include: orgInclude });
    if (!org) throw new NotFoundException(`Organization with id ${id} not found`);

    const ownerMember = org.members.find((m) => m.role === 'OWNER');
    if (!ownerMember || ownerMember.userId !== userId) {
      throw new ForbiddenException('Only the organization owner can update it');
    }

    const updated = await prisma.organization.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name, slug: slugify(dto.name) }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.industry !== undefined && { industry: dto.industry }),
      },
      include: orgInclude,
    });
    return this.formatOrg(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const org = await prisma.organization.findUnique({ where: { id }, include: orgInclude });
    if (!org) throw new NotFoundException(`Organization with id ${id} not found`);

    const ownerMember = org.members.find((m) => m.role === 'OWNER');
    if (!ownerMember || ownerMember.userId !== userId) {
      throw new ForbiddenException('Only the organization owner can delete it');
    }

    await prisma.organization.delete({ where: { id } });
  }

  async addMember(id: string, dto: InviteMemberDto, userId: string) {
    const org = await prisma.organization.findUnique({ where: { id }, include: orgInclude });
    if (!org) throw new NotFoundException(`Organization with id ${id} not found`);

    const currentMember = org.members.find((m) => m.userId === userId);
    if (!currentMember || (currentMember.role !== 'OWNER' && currentMember.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can invite members');
    }

    const invitedUser = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!invitedUser) {
      throw new NotFoundException('User with this email not found');
    }

    if (org.members.some((m) => m.userId === invitedUser.id)) {
      throw new ConflictException('User is already a member of this organization');
    }

    await prisma.organizationMember.create({
      data: {
        organizationId: id,
        userId: invitedUser.id,
        role: memberRoleMap[dto.role] as any,
      },
    });

    const updated = await prisma.organization.findUnique({ where: { id }, include: orgInclude });
    return this.formatOrg(updated!);
  }

  async removeMember(id: string, memberUserId: string, userId: string) {
    const org = await prisma.organization.findUnique({ where: { id }, include: orgInclude });
    if (!org) throw new NotFoundException(`Organization with id ${id} not found`);

    const currentMember = org.members.find((m) => m.userId === userId);
    if (!currentMember || (currentMember.role !== 'OWNER' && currentMember.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can remove members');
    }

    const memberToRemove = org.members.find((m) => m.userId === memberUserId);
    if (!memberToRemove) {
      throw new NotFoundException('Member not found');
    }

    await prisma.organizationMember.delete({ where: { id: memberToRemove.id } });

    const updated = await prisma.organization.findUnique({ where: { id }, include: orgInclude });
    return this.formatOrg(updated!);
  }

  private formatOrg(org: any) {
    const ownerMember = org.members.find((m: any) => m.role === 'OWNER');
    return {
      id: org.id,
      name: org.name,
      description: org.description,
      website: org.website,
      industry: org.industry,
      ownerId: ownerMember?.userId || '',
      members: org.members.map((m: any) => ({
        userId: m.userId,
        email: m.user?.email || '',
        role: m.role,
        joinedAt: m.createdAt,
      })),
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }
}
