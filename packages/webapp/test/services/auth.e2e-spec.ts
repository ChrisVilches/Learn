import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthService } from '../../src/auth/services/auth';
import { app } from '../helpers/setup';

describe(AuthService.name, () => {
  let authService: AuthService;

  beforeAll(() => {
    authService = app.get<AuthService>(AuthService);
  });

  it.skip('performs case-insensitive queries on username and email', async () => {
    await authService.createNewUserRegistration(
      'mail@gmail.com',
      'user',
      'pass',
    );

    await expect(
      authService.createNewUserRegistration('mail@Gmail.com', 'User', 'pass'),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    await expect(
      authService.createNewUserRegistration('mail@Gmail.com', 'user', 'pass'),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    await expect(
      authService.createNewUserRegistration('mail@gmail.com', 'User', 'pass'),
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });
});
