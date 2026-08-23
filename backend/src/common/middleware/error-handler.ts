import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { SystemException, ValidationException, isSystemException, isValidationException } from '../exceptions/system-exception';
import logger from '../../config/logger';

export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as any).id || req.headers['x-trace-id'] || '';

  if (err instanceof ValidationException) {
    res.apiValidationError(err.errors, err.message);
    return;
  }

  if (err instanceof SystemException) {
    logger.warn('System exception', { traceId, code: err.code, message: err.message, path: req.path });
    res.apiError(err.message, err.code, err.data);
    return;
  }

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    logger.warn('Auth error', { traceId, message: err.message, path: req.path });
    res.apiError('Invalid or expired token', 401108);
    return;
  }

  if (err.name === 'ValidationError') {
    res.apiError(err.message, 400111);
    return;
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      res.apiError('Resource already exists', 400202);
      return;
    }
    if (prismaErr.code === 'P2025') {
      res.apiError('Resource not found', 400201);
      return;
    }
  }

  logger.error('Unhandled error', { traceId, err: err.stack, path: req.path, method: req.method });
  res.apiError('Internal server error', 500901);
};

export const notFoundHandler: RequestHandler = (req: Request, res: Response) => {
  res.apiError('Route not found', 400114);
};