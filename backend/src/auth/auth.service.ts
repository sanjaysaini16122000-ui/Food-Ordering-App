import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginInput, SignupInput } from './auth.inputs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, country: user.country };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async signup(input: SignupInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role, country: user.country };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
