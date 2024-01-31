import {
  BadRequestException,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { type Observable, catchError } from 'rxjs';
import { ZodError } from 'zod';
import { ParseError } from 'problem-generator/dist/types/errors';
import { ZodPipeError } from '../pipes/zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { SolutionCannotBeProcessed } from '../../logic/problem-errors';

const handleZodPipeError = (e: ZodPipeError): void => {
  throw new BadRequestException(e.zodError.errors);
};

const handlePrismaError = (err: PrismaClientKnownRequestError): void => {
  if (err.code === 'P2025') {
    throw new NotFoundException();
  }
};

export class ErrorMappingInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (err instanceof ZodError) {
          throw new InternalServerErrorException();
        }

        if (err instanceof ZodPipeError) {
          handleZodPipeError(err);
        }

        if (err instanceof PrismaClientKnownRequestError) {
          handlePrismaError(err);
        }

        if (err instanceof ParseError) {
          throw new BadRequestException('Cannot parse solution');
        }

        if (err instanceof SolutionCannotBeProcessed) {
          throw new BadRequestException(err.message);
        }

        throw err;
      }),
    );
  }
}
