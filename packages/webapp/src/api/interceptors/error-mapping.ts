import {
  BadRequestException,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { type Observable, catchError } from 'rxjs';
import { ZodError } from 'zod';
import {
  ForbiddenSolveProblem,
  ProblemAlreadyAttempted,
} from '../../logic/problem-errors';

const handleZodError = ({ errors }: ZodError): void => {
  throw new BadRequestException(errors);
};

const handlePrismaError = (err: PrismaClientKnownRequestError): void => {
  console.log('Handling error');
  if (err.code === 'P2025') {
    throw new NotFoundException();
  }
};

export class ErrorMappingInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (err instanceof ZodError) {
          handleZodError(err);
        }

        if (err instanceof PrismaClientKnownRequestError) {
          handlePrismaError(err);
        }

        // TODO: I should create a class like PrismaClientKnownRequestError and just set some error codes
        //       Then just type one "handleBusinessLogicError" and handle them somewhere else.
        //       That way I can keep this mapper lean, and divide code.

        if (
          err instanceof ForbiddenSolveProblem ||
          err instanceof ProblemAlreadyAttempted
        ) {
          throw new BadRequestException(err.message);
        }

        throw err;
      }),
    );
  }
}
