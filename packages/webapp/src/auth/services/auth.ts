import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { generatePassword, passwordCheck } from '../../auth/password';
import { PrismaService } from '../../logic/services/prisma';
import { UserService } from '../../logic/services/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // TODO: Change names. I don't understand what everything means lol (I don't understand
  //       where in the flow is every method located.)
  async validateUser(
    username: string,
    password: string,
  ): Promise<Pick<User, 'id' | 'email' | 'username'> | null> {
    const user = await this.userService.findUserByUsername(username);

    if (
      user !== null &&
      (await passwordCheck(password, user.password, user.salt))
    ) {
      const { id, email, username } = user;
      return { id, email, username };
    }

    return null;
  }

  async registerUser(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const { hashedPassword, salt } = await generatePassword(password);

    return await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        salt,
      },
    });
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
