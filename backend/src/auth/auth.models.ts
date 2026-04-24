import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role, Country } from '../common/enums';

registerEnumType(Role, { name: 'Role' });
registerEnumType(Country, { name: 'Country' });

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Country)
  country: Country;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
