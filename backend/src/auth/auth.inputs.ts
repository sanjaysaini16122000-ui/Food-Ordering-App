import { InputType, Field } from '@nestjs/graphql';
import { Role, Country } from '../common/enums';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class SignupInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Country)
  country: Country;
}
