import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RoleType, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Return the authenticated user's own profile and details.
   */
  async getOwnProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        status: true,
        isMobileVerified: true,
        isEmailVerified: true,
        createdAt: true,
        userRoles: {
          select: {
            role: {
              select: { name: true, description: true },
            },
          },
        },
        customer: {
          select: {
            id: true,
            referralCode: true,
            avatarUrl: true,
            addresses: {
              orderBy: { isDefault: 'desc' },
            },
            _count: {
              select: { orders: true, reviews: true },
            },
          },
        },
        partner: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            experienceYears: true,
            photoUrl: true,
            serviceRadiusKm: true,
            city: true,
            state: true,
            pincode: true,
            kycStatus: true,
            rating: true,
            reviewCount: true,
            completedJobsCount: true,
            isAvailable: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    return {
      ...user,
      roles,
    };
  }

  /**
   * Return a specific user's details.
   * STRICT ACCESS CONTROL:
   * Only administrators (ADMIN, SUPER_ADMIN) can view other users' profiles and details.
   * Regular users attempting to view another user's details receive a 403 Forbidden error.
   */
  async getUserDetails(
    targetUserId: string,
    requestingUser: { userId: string; roles: string[] },
  ) {
    const isAdmin =
      requestingUser.roles.includes(RoleType.ADMIN) ||
      requestingUser.roles.includes(RoleType.SUPER_ADMIN);

    const isSelf = requestingUser.userId === targetUserId;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException(
        'Access denied: You cannot view the profile or details of other users. Only administrators have permission to view all user details.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        status: true,
        isMobileVerified: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        userRoles: {
          select: {
            role: {
              select: { name: true, description: true },
            },
          },
        },
        customer: {
          select: {
            id: true,
            referralCode: true,
            avatarUrl: true,
            addresses: true,
            _count: {
              select: { orders: true, reviews: true },
            },
          },
        },
        partner: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            experienceYears: true,
            photoUrl: true,
            serviceRadiusKm: true,
            city: true,
            state: true,
            pincode: true,
            kycStatus: true,
            kycRejectionReason: true,
            rating: true,
            reviewCount: true,
            completedJobsCount: true,
            isAvailable: true,
            documents: isAdmin, // Only admins can inspect partner verification documents
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);

    // If admin is viewing, also fetch audit logs for this user
    let recentAuditLogs: any[] = [];
    if (isAdmin) {
      recentAuditLogs = await this.prisma.auditLog.findMany({
        where: { userId: targetUserId },
        take: 10,
        orderBy: { timestamp: 'desc' },
      });
    }

    return {
      ...user,
      roles,
      auditLogs: recentAuditLogs,
      viewedAsAdmin: isAdmin && !isSelf,
    };
  }

  /**
   * List all users on the platform.
   * STRICT ACCESS CONTROL:
   * Accessible exclusively to administrators.
   */
  async listAllUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    role?: RoleType;
    status?: UserStatus;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.role) {
      where.userRoles = {
        some: {
          role: {
            name: query.role,
          },
        },
      };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
        { mobile: { contains: query.search } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          status: true,
          isMobileVerified: true,
          isEmailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          userRoles: {
            select: {
              role: {
                select: { name: true },
              },
            },
          },
          customer: {
            select: {
              id: true,
              _count: {
                select: { orders: true },
              },
            },
          },
          partner: {
            select: {
              id: true,
              businessName: true,
              kycStatus: true,
              rating: true,
              completedJobsCount: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const formattedUsers = users.map((u) => ({
      ...u,
      roles: u.userRoles.map((ur) => ur.role.name),
    }));

    return {
      data: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
