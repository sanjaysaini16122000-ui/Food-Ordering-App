import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './order.models';
import { OrderStatus, Country } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, country: Country, input: CreateOrderInput) {
    let total = 0;
    const items = [];

    for (const item of input.items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });
      if (!menuItem) throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      
      total += menuItem.price * item.quantity;
      items.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    return this.prisma.order.create({
      data: {
        userId,
        country,
        total,
        status: OrderStatus.PENDING,
        orderItems: {
          create: items,
        },
      },
      include: { orderItems: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus, country: Country) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, country },
    });
    if (!order) throw new NotFoundException('Order not found in your country');
    
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
