import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { Restaurant, MenuItem } from './restaurant.models';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/current-user.decorator';

@Resolver()
@UseGuards(GqlAuthGuard)
export class RestaurantResolver {
  constructor(private restaurantService: RestaurantService) {}

  @Query(() => [Restaurant])
  async getRestaurants(@CurrentUser() user: any) {
    return this.restaurantService.findAll(user.country);
  }

  @Query(() => [MenuItem])
  async getMenuItems(@Args('restaurantId', { type: () => ID }) restaurantId: string) {
    return this.restaurantService.findMenuItems(restaurantId);
  }
}
