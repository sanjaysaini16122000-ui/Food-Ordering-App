import { Resolver, Mutation, Args, Field, InputType, ObjectType, ID } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/roles.decorator';
import { Role } from '@prisma/client';

@InputType()
class AddPaymentMethodInput {
  @Field()
  type: string;

  @Field()
  provider: string;

  @Field({ nullable: true })
  lastFour?: string;

  @Field(() => ID)
  userId: string;
}

@ObjectType()
class PaymentMethod {
  @Field(() => ID)
  id: string;

  @Field()
  type: string;

  @Field()
  provider: string;
}

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard)
export class PaymentResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => PaymentMethod)
  @Roles(Role.ADMIN)
  async addPaymentMethod(@Args('input') input: AddPaymentMethodInput) {
    return this.prisma.paymentMethod.create({
      data: input,
    });
  }
}
