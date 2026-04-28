import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RestaurantService } from './restaurants/restaurant.service';
import { RestaurantResolver } from './restaurants/restaurant.resolver';
import { OrderService } from './orders/order.service';
import { OrderResolver } from './orders/order.resolver';
import { PaymentResolver } from './payments/payment.resolver';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
  ],
  providers: [
    RestaurantService,
    RestaurantResolver,
    OrderService,
    OrderResolver,
    PaymentResolver,
  ],
})
export class AppModule {}
