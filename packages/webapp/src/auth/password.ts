import { pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'util';

export const hashIterations = 200_000;
export const hashKeyLen = 32;
export const pbkdf2Async = promisify(pbkdf2);

export async function generatePassword(
  password: string,
): Promise<{ hashedPassword: string; salt: string }> {
  const salt = randomBytes(16).toString('base64');
  const hashedPassword = await pbkdf2Async(
    password,
    salt,
    hashIterations,
    hashKeyLen,
    'sha256',
  );

  return { hashedPassword: hashedPassword.toString('hex'), salt };
}

export async function passwordCheck(
  attemptPassword: string,
  storedPassword: string,
  storedSalt: string,
): Promise<boolean> {
  const result = await pbkdf2Async(
    attemptPassword,
    storedSalt,
    hashIterations,
    hashKeyLen,
    'sha256',
  );

  return timingSafeEqual(Buffer.from(storedPassword, 'hex'), result);
}
