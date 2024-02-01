import * as request from 'supertest';
import { User } from '@prisma/client';
import { app, httpServer } from './setup';
import { AuthService } from '../../src/auth/services/auth';

export type AuthFn = <T extends { set: (h: string, v: string) => T }>(
  req: T,
) => T;

export async function createUserAndLogin(
  email: string,
  username: string,
  password: string,
): Promise<{
  user: User;
  auth: AuthFn;
}> {
  const user = await app
    .get<AuthService>(AuthService)
    .createNewUserRegistration(email, username, password);

  const auth: AuthFn = (req) => {
    return req.set('Authorization', `Bearer ${body.accessToken}`);
  };

  const { body } = await request(httpServer).post('/auth/login').send({
    username,
    password,
  });

  return { user, auth };
}
