import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, CreateOrderInput } from './order.models';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { Role, OrderStatus } from '../common/enums';

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order])
  async getOrders(@CurrentUser() user: any) {
    return this.orderService.findAll(user.sub);
  }

  @Mutation(() => Order)
  async createOrder(
    @CurrentUser() user: any,
    @Args('input') input: CreateOrderInput,
  ) {
    return this.orderService.create(user.sub, user.country, input);
  }

  @Mutation(() => Order)
  @Roles(Role.ADMIN, Role.MANAGER)
  async checkoutOrder(@CurrentUser() user: any, @Args('orderId', { type: () => ID }) orderId: string) {
    return this.orderService.updateStatus(orderId, OrderStatus.PAID, user.country);
  }

  @Mutation(() => Order)
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelOrder(@CurrentUser() user: any, @Args('orderId', { type: () => ID }) orderId: string) {
    return this.orderService.updateStatus(orderId, OrderStatus.CANCELLED, user.country);
  }
}
