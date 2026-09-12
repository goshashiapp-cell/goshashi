import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @CurrentUser('customerId') customerId: string,
    @Body()
    body: {
      addressId: string;
      scheduledDate: string;
      scheduledTime: string;
      notes?: string;
      couponCode?: string;
    },
  ) {
    return this.ordersService.createOrder(customerId, body);
  }

  @Get()
  async getOrders(@CurrentUser('customerId') customerId: string) {
    return this.ordersService.getCustomerOrders(customerId);
  }

  @Get(':id')
  async getOrderById(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.ordersService.getOrderById(id, {
      userId: user?.sub,
      customerId: user?.customerId,
      partnerId: user?.partnerId,
      roles: user?.roles || [],
    });
  }

  @Post(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body('reason') reason?: string,
  ) {
    return this.ordersService.cancelOrder(id, userId, reason);
  }
}
