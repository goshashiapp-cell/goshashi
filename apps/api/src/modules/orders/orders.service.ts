import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PartnerMatchingService } from './partner-matching.service';
import { OrderStatus, PaymentStatus, RoleType } from '@prisma/client';
import { BUSINESS_CONFIG } from '@goshashi/config';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private partnerMatchingService: PartnerMatchingService,
  ) {}

  async createOrder(
    customerId: string,
    data: {
      addressId: string;
      scheduledDate: string;
      scheduledTime: string;
      notes?: string;
      couponCode?: string;
    },
  ) {
    // 1. Fetch cart items
    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            service: true,
            addons: { include: { addon: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cannot create booking: cart is empty');
    }

    const address = await this.prisma.address.findUnique({
      where: { id: data.addressId },
    });

    if (!address) {
      throw new NotFoundException('Selected address not found');
    }

    // 2. Strict server-side recalculation of subtotal, addons, tax
    let subtotal = 0;
    let addonsTotal = 0;

    for (const item of cart.items) {
      const price = item.service.salePrice ?? item.service.basePrice;
      subtotal += price * item.quantity;
      for (const ad of item.addons) {
        addonsTotal += ad.addon.price * item.quantity;
      }
    }

    let discountTotal = 0;
    // Coupon check
    if (data.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });
      if (coupon && coupon.status) {
        if (subtotal >= coupon.minimumOrder) {
          if (coupon.type === 'FIXED') {
            discountTotal = coupon.value;
          } else {
            discountTotal = (subtotal * coupon.value) / 100;
            if (coupon.maximumDiscount && discountTotal > coupon.maximumDiscount) {
              discountTotal = coupon.maximumDiscount;
            }
          }
        }
      }
    }

    const taxableAmount = Math.max(0, subtotal + addonsTotal - discountTotal);
    const taxTotal = Number((taxableAmount * 0.18).toFixed(2));
    const platformFee = BUSINESS_CONFIG.DEFAULT_PLATFORM_FEE;
    const finalTotal = taxableAmount + taxTotal + platformFee;

    // 3. Generate sequential order number
    const orderCount = await this.prisma.order.count();
    const orderNumber = `GS-${new Date().getFullYear()}-${String(orderCount + 1).padStart(5, '0')}`;

    // 4. Create Order in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          addressId: data.addressId,
          status: OrderStatus.PENDING_PAYMENT,
          scheduledDate: new Date(data.scheduledDate),
          scheduledTime: data.scheduledTime,
          subtotal,
          addonsTotal,
          discountTotal,
          taxTotal,
          platformFee,
          finalTotal,
          notes: data.notes,
        },
      });

      // Create Order Items
      for (const item of cart.items) {
        const itemPrice = item.service.salePrice ?? item.service.basePrice;
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            serviceId: item.serviceId,
            serviceName: item.service.name,
            basePrice: item.service.basePrice,
            salePrice: item.service.salePrice,
            quantity: item.quantity,
            totalPrice: itemPrice * item.quantity,
          },
        });

        // Addons
        for (const ad of item.addons) {
          await tx.orderItemAddon.create({
            data: {
              orderItemId: orderItem.id,
              addonId: ad.addonId,
              name: ad.addon.name,
              price: ad.addon.price,
            },
          });
        }
      }

      // Initial Status History record
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          oldStatus: null,
          newStatus: OrderStatus.PENDING_PAYMENT,
          changedBy: customerId,
          reason: 'Booking initiated by customer',
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return this.getOrderById(order.id);
  }

  async getCustomerOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        address: true,
        partner: {
          select: {
            id: true,
            user: { select: { name: true, mobile: true } },
            rating: true,
          },
        },
      },
    });
  }

  async getOrderById(
    orderId: string,
    requestingUser?: {
      userId?: string;
      customerId?: string;
      partnerId?: string;
      roles?: string[];
    },
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { addons: true } },
        address: true,
        customer: { include: { user: { select: { name: true, email: true, mobile: true } } } },
        partner: {
          include: {
            user: { select: { name: true, mobile: true } },
          },
        },
        statusHistory: { orderBy: { timestamp: 'desc' } },
        payment: true,
        invoice: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (requestingUser) {
      const isAdmin =
        requestingUser.roles?.includes(RoleType.ADMIN) ||
        requestingUser.roles?.includes(RoleType.SUPER_ADMIN) ||
        requestingUser.roles?.includes(RoleType.OPERATIONS);

      const isOwnerCustomer =
        requestingUser.customerId && order.customerId === requestingUser.customerId;
      const isAssignedPartner =
        requestingUser.partnerId && order.partnerId === requestingUser.partnerId;

      if (!isAdmin && !isOwnerCustomer && !isAssignedPartner) {
        throw new ForbiddenException(
          'Access denied: You do not have permission to view other users\' order details',
        );
      }
    }

    return order;
  }

  async cancelOrder(orderId: string, userId: string, reason?: string) {
    const order = await this.getOrderById(orderId);

    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Cannot cancel order in status ${order.status}`);
    }

    // Cancellation policy check
    const scheduledTime = new Date(order.scheduledDate).getTime();
    const now = Date.now();
    const hoursDiff = (scheduledTime - now) / (1000 * 60 * 60);

    let fee = 0;
    if (order.status === OrderStatus.ARRIVED) {
      fee = BUSINESS_CONFIG.CANCELLATION_RULES.VISIT_FEE_AFTER_ARRIVAL;
    } else if (hoursDiff < BUSINESS_CONFIG.CANCELLATION_RULES.FREE_CANCELLATION_HOURS_BEFORE) {
      fee = BUSINESS_CONFIG.CANCELLATION_RULES.LATE_CANCELLATION_FEE;
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          cancellationFee: fee,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          oldStatus: order.status,
          newStatus: OrderStatus.CANCELLED,
          changedBy: userId,
          reason: reason || 'Customer requested cancellation',
        },
      });

      return updated;
    });
  }

  async transitionStatus(
    orderId: string,
    newStatus: OrderStatus,
    changedBy: string,
    reason?: string,
    extraData?: {
      beforePhotos?: string[];
      afterPhotos?: string[];
      completionNotes?: string;
    },
  ) {
    const order = await this.getOrderById(orderId);

    return this.prisma.$transaction(async (tx) => {
      const updatePayload: any = { status: newStatus };
      if (extraData?.beforePhotos) {
        updatePayload.beforePhotos = JSON.stringify(extraData.beforePhotos);
      }
      if (extraData?.afterPhotos) {
        updatePayload.afterPhotos = JSON.stringify(extraData.afterPhotos);
      }
      if (extraData?.completionNotes) {
        updatePayload.completionNotes = extraData.completionNotes;
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: updatePayload,
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          oldStatus: order.status,
          newStatus,
          changedBy,
          reason,
        },
      });

      return updated;
    });
  }
}
