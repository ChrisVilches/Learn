import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthService } from '../../src/auth/services/auth';
import { server } from '../helpers/setup';

describe(AuthService.name, () => {
  it.skip('performs case-insensitive queries on username and email', async () => {
    await server.app
      .get<AuthService>(AuthService)
      .createNewUserRegistration('mail@gmail.com', 'user', 'pass');

    await expect(
      server.app
        .get<AuthService>(AuthService)
        .createNewUserRegistration('mail@Gmail.com', 'User', 'pass'),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    await expect(
      server.app
        .get<AuthService>(AuthService)
        .createNewUserRegistration('mail@Gmail.com', 'user', 'pass'),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    await expect(
      server.app
        .get<AuthService>(AuthService)
        .createNewUserRegistration('mail@gmail.com', 'User', 'pass'),
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });
});
