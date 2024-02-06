import {
  BadRequestException,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { type Observable, catchError } from 'rxjs';
import { ParseError } from 'problem-generator/dist/types/errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { SolutionCannotBeProcessed } from '../../logic/problem-errors';

const handlePrismaError = (err: PrismaClientKnownRequestError): void => {
  if (err.code === 'P2025') {
    throw new NotFoundException();
  }
};

export class ErrorMappingInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
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
