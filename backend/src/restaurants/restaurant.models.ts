import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Country } from '@prisma/client';

@ObjectType()
export class Restaurant {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Country)
  country: Country;

  @Field(() => [MenuItem], { nullable: true })
  menuItems?: MenuItem[];
}

@ObjectType()
export class MenuItem {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  description?: string;
}
