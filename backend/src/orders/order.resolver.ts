import { Resolver, Query, Mutation, Subscription, Args, ID } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, CreateOrderInput } from './order.models';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { Role, OrderStatus } from '../common/enums';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
const ORDER_STATUS_UPDATED = 'orderStatusUpdated';

@Resolver()
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order])
  @UseGuards(GqlAuthGuard, RolesGuard)
  async getOrders(@CurrentUser() user: any) {
    return this.orderService.findAll(user.sub);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createOrder(
    @CurrentUser() user: any,
    @Args('input') input: CreateOrderInput,
  ) {
    return this.orderService.create(user.sub, user.country, input);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async checkoutOrder(@CurrentUser() user: any, @Args('orderId', { type: () => ID }) orderId: string) {
    const order = await this.orderService.updateStatus(orderId, OrderStatus.PAID, user.country);
    pubSub.publish(ORDER_STATUS_UPDATED, { orderStatusUpdated: order });
    return order;
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelOrder(@CurrentUser() user: any, @Args('orderId', { type: () => ID }) orderId: string) {
    const order = await this.orderService.updateStatus(orderId, OrderStatus.CANCELLED, user.country);
    pubSub.publish(ORDER_STATUS_UPDATED, { orderStatusUpdated: order });
    return order;
  }

  @Subscription(() => Order, {
    filter: (payload, variables) => payload.orderStatusUpdated.userId === variables.userId,
  })
  orderStatusUpdated(@Args('userId', { type: () => ID }) userId: string) {
    return pubSub.asyncIterableIterator(ORDER_STATUS_UPDATED);
  }
}

