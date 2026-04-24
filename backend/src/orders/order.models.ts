import { Field, ObjectType, ID, Float, Int, InputType, registerEnumType } from '@nestjs/graphql';
import { OrderStatus, Country } from '@prisma/client';

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  total: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Field()
  createdAt: Date;
}

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderItemInput])
  items: OrderItemInput[];
}

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  menuItemId: string;

  @Field(() => Int)
  quantity: number;
}
