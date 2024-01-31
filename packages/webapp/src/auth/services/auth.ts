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

  async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<Pick<User, 'id' | 'email' | 'username'> | null> {
    const user = await this.userService.findUserByUsername(username.trim());

    if (
      user !== null &&
      (await passwordCheck(password, user.password, user.salt))
    ) {
      const { id, email, username } = user;
      return { id, email, username };
    }

    return null;
  }

  async createNewUserRegistration(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const { hashedPassword, salt } = await generatePassword(password);

    // TODO: Email and username have to be case-insensitive, but it's not
    //       so easy to implement.
    //       * If I use a PG extension in `development` or `test`, I can
    //         verify integration tests pass, but I won't be able to verify
    //         it's installed correctly on production.
    //       * If I use mode: 'insensitive', it will work for filtering, but
    //         won't work for adding new users (i.e. the code below).
    //       Can this help?
    //       https://stackoverflow.com/a/59101567/4757175
    return await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        salt,
      },
    });
  }

  async signUserToken(id: number, username: string) {
    const payload = { username, sub: id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
