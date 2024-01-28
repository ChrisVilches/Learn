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
  SolutionCannotBeProcessed,
} from '../../logic/problem-errors';
import { ParseError } from 'problem-generator/dist/types/errors';

// TODO: Note that this can also be errors from the problem generator parsing (problem-generator module),
//       so sometimes it may leak keys like "correctAnswer" to the client, which shouldn't happen!!
const handleZodError = ({ errors }: ZodError): void => {
  throw new BadRequestException(errors);
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
          handleZodError(err);
        }

        if (err instanceof PrismaClientKnownRequestError) {
          handlePrismaError(err);
        }

        if (
          err instanceof ForbiddenSolveProblem ||
          err instanceof ProblemAlreadyAttempted
        ) {
          throw new BadRequestException(err.message);
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
