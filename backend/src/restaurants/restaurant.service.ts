import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country } from '../common/enums';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async findAll(country: Country) {
    return this.prisma.restaurant.findMany({
      where: { country },
      include: { menuItems: true },
    });
  }

  async findMenuItems(restaurantId: string) {
    return this.prisma.menuItem.findMany({
      where: { restaurantId },
    });
  }
}
