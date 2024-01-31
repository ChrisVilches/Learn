import * as request from 'supertest';
import { server } from '../helpers/setup';
import { AuthService } from '../../src/auth/services/auth';

describe('/auth/login', () => {
  it('rejects incorrect credentials', async () => {
    const { body, status } = await request(server.httpServer)
      .post('/auth/login')
      .send({
        username: 'wrongusername',
        password: 'testpassword',
      });

    expect(status).toBe(401);
    expect(body).not.toHaveProperty('token');
  });

  describe('user exists', () => {
    beforeEach(async () => {
      const authService = server.app.get<AuthService>(AuthService);
      await authService.createNewUserRegistration(
        'chris@mail.com',
        'chris',
        'mypassword',
      );
    });

    it('accepts correct credentials', async () => {
      const { body } = await request(server.httpServer)
        .post('/auth/login')
        .send({
          username: 'chris',
          password: 'mypassword',
        })
        .expect(201);

      expect(body).toHaveProperty('accessToken');
    });

    it('rejects email', async () => {
      const { body } = await request(server.httpServer)
        .post('/auth/login')
        .send({
          username: 'chris@mail.com',
          password: 'mypassword',
        })
        .expect(401);

      expect(body).not.toHaveProperty('accessToken');
    });
  });
});
