import { Response } from 'express';
import { PaginationMeta } from './pagination';
import logger from '../../config/logger';
import { v4 as uuidv4 } from 'uuid';

export interface ApiResponse<T = any> {
  error: boolean;
  code: number;
  message: string;
  data: T | null;
  pagination?: PaginationMeta;
  traceId: string;
  timestamp: string;
}

export const ErrorCodes = {
  BAD_REQUEST: 400000,
  UNAUTHORIZED: 401000,
  FORBIDDEN: 403000,
  NOT_FOUND: 404000,
  VALIDATION_ERROR: 400100,
  INTERNAL_ERROR: 500000,
  DATABASE_ERROR: 500100,
};

export const ApiResponseHelper = {
  success<T>(data: T | null = null, message = 'success', code = 200): ApiResponse<T | null> {
    return {
      error: false,
      code,
      message,
      data,
      traceId: '',
      timestamp: new Date().toISOString(),
    };
  },

  error(message = 'error', code = ErrorCodes.INTERNAL_ERROR, data = null): ApiResponse<null> {
    return {
      error: true,
      code,
      message,
      data,
      traceId: '',
      timestamp: new Date().toISOString(),
    };
  },

  validationError(errors: any[], message = 'Validation failed'): ApiResponse<any[]> {
    return {
      error: true,
      code: ErrorCodes.VALIDATION_ERROR,
      message,
      data: errors,
      traceId: '',
      timestamp: new Date().toISOString(),
    };
  },

  badRequest(message = 'Bad request', data = null): ApiResponse<null> {
    return this.error(message, ErrorCodes.BAD_REQUEST, data);
  },

  unauthorized(message = 'Unauthorized', data = null): ApiResponse<null> {
    return this.error(message, ErrorCodes.UNAUTHORIZED, data);
  },

  forbidden(message = 'Forbidden', data = null): ApiResponse<null> {
    return this.error(message, ErrorCodes.FORBIDDEN, data);
  },

  notFound(message = 'Not found', data = null): ApiResponse<null> {
    return this.error(message, ErrorCodes.NOT_FOUND, data);
  },
};

declare global {
  namespace Express {
    interface Response {
      apiSuccess<T>(data: T | null, message?: string, code?: number, pagination?: PaginationMeta): this;
      apiError(message: string, code?: number, data?: any): this;
      apiValidationError(errors: any[], message?: string): this;
      getTraceId(): string;
    }
  }
}

export function attachApiResponseHelpers(req: any, res: any, next: any) {
  const traceId = req.headers['x-trace-id'] || req.id || uuidv4();
  res.getTraceId = () => traceId;

  res.apiSuccess = function <T>(data: T | null = null, message = 'success', code = 200, pagination?: PaginationMeta) {
    return this.status(code).json({
      error: false,
      code,
      message,
      data,
      ...(pagination && { pagination }),
      traceId,
      timestamp: new Date().toISOString(),
    });
  };

  res.apiError = function (message = 'error', code = ErrorCodes.INTERNAL_ERROR, data: any = null) {
    const httpStatus = Math.floor(code / 1000) || 500;
    return this.status(httpStatus).json({
      error: true,
      code,
      message,
      data,
      traceId,
      timestamp: new Date().toISOString(),
    });
  };

  res.apiValidationError = function (errors: any[], message = 'Validation failed') {
    return this.status(400).json({
      error: true,
      code: ErrorCodes.VALIDATION_ERROR,
      message,
      data: errors,
      traceId,
      timestamp: new Date().toISOString(),
    });
  };

  next();
}

export { attachApiResponseHelpers as traceMiddleware };

export function handleControllerError(
  res: Response,
  error: any,
  context: string,
  defaultMessage = 'An error occurred'
): void {
  logger.error(`[${context}]`, {
    error: error?.message || error,
    stack: error?.stack,
    name: error?.name,
  });

  if (error?.name === 'PrismaClientKnownRequestError') {
    res.apiError(
      'Database operation failed',
      ErrorCodes.DATABASE_ERROR,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
    return;
  }

  if (error?.name === 'ValidationError') {
    res.apiError(
      error.message || 'Validation failed',
      ErrorCodes.VALIDATION_ERROR
    );
    return;
  }

  res.apiError(
    error?.message || defaultMessage,
    ErrorCodes.INTERNAL_ERROR,
    process.env.NODE_ENV === 'development' ? { stack: error?.stack } : undefined
  );
}

export function withTryCatch<T extends (req: any, res: Response) => Promise<void>>(
  handler: T,
  context: string
): T {
  return (async (req: any, res: Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      handleControllerError(res, error, context);
    }
  }) as T;
}
