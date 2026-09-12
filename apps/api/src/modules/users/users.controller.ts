import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleType, UserStatus } from '@prisma/client';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get own profile and details.
   * Any authenticated user can view their own details.
   */
  @Get('me')
  async getOwnProfile(@CurrentUser('sub') userId: string) {
    return this.usersService.getOwnProfile(userId);
  }

  /**
   * Get specific user profile and details.
   * Access control:
   * - Admin/Super Admin can view EVERY user's details.
   * - Regular user can ONLY view their own details.
   * - Non-admin attempting to view another user's details gets 403 Forbidden.
   */
  @Get(':id')
  async getUserDetails(
    @Param('id') targetUserId: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const requestingUser = {
      userId: user?.sub,
      roles: user?.roles || [],
    };

    return this.usersService.getUserDetails(targetUserId, requestingUser);
  }

  /**
   * List all users on the platform.
   * STRICT ACCESS CONTROL:
   * Only administrators can view the full users list.
   */
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @Get()
  async listAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: RoleType,
    @Query('status') status?: UserStatus,
  ) {
    return this.usersService.listAllUsers({
      page,
      limit,
      search,
      role,
      status,
    });
  }
}
