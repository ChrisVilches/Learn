import * as request from 'supertest';
import { httpServer } from '../helpers/setup';
import prisma from '../helpers/prisma';
import { Category, User } from '@prisma/client';
import { CategoryService } from '../../src/logic/services/category';
import { sample } from 'lodash';
import { AuthFn, createUserAndLogin } from '../helpers/user-login';
import { CategoryFactory } from '../helpers/factory';

describe(CategoryService.name, () => {
  describe('setCategoryPreferences', () => {
    let user: User;
    let category: Category;
    let auth: AuthFn;

    const getDifficulty = async () => {
      const pref = await prisma.categoryPreferences.findUnique({
        where: {
          userId_categoryId: {
            userId: user.id,
            categoryId: category.id,
          },
        },
      });
      return pref?.difficulty;
    };

    beforeEach(async () => {
      const userResult = await createUserAndLogin(
        'mail@gmail.com',
        'user',
        'pass',
      );
      user = userResult.user;
      auth = userResult.auth;

      category = await CategoryFactory.create({ slug: 'the-slug' });
    });

    it('rejects invalid keys', () =>
      auth(request(httpServer).put('/category/slug/preferences'))
        .send({ someKey: 34 })
        .expect(400));

    it('accepts empty difficulty', async () => {
      expect(await getDifficulty()).toBeUndefined();
      const { body } = await auth(
        request(httpServer).put('/category/the-slug/preferences'),
      )
        .send({})
        .expect(200);

      expect(body.difficulty).toBe(10);
      expect(await getDifficulty()).toBe(10);
    });

    it('rejects invalid difficulty', () =>
      auth(request(httpServer).put('/category/slug/preferences'))
        .send({ difficulty: sample([-2, -1, 0, 101, 102]) })
        .expect(400));
  });
});
