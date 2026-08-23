import { ErrorCode, ErrorMessage, getErrorMessage } from './error-codes';

export class SystemException extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly data: any;

  constructor(code: ErrorCode, message?: string, data?: any) {
    super(message || ErrorMessage[code]);
    this.name = 'SystemException';
    this.code = code;
    this.statusCode = Math.floor(code / 1000) || 500;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }

  static unauthorized(message?: string): SystemException {
    return new SystemException(ErrorCode.UNAUTHORIZED_REQUEST, message);
  }

  static forbidden(message?: string): SystemException {
    return new SystemException(ErrorCode.FORBIDDEN_REQUEST, message);
  }

  static notFound(message?: string): SystemException {
    return new SystemException(ErrorCode.RESOURCE_NOT_FOUND, message);
  }

  static alreadyExists(message?: string): SystemException {
    return new SystemException(ErrorCode.RESOURCE_ALREADY_EXISTS, message);
  }

  static invalidValue(message?: string): SystemException {
    return new SystemException(ErrorCode.INVALID_VALUE, message);
  }

  static missingParams(message?: string): SystemException {
    return new SystemException(ErrorCode.MISSING_REQUIRED_PARAMETERS, message);
  }

  static internal(message?: string): SystemException {
    return new SystemException(ErrorCode.INTERNAL_ERROR, message);
  }
}

export class ValidationException extends Error {
  public readonly code = ErrorCode.INVALID_VALUE;
  public readonly statusCode = 400;
  public readonly errors: any[];

  constructor(errors: any[]) {
    super(ErrorMessage[ErrorCode.INVALID_VALUE]);
    this.name = 'ValidationException';
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function isSystemException(err: any): err is SystemException {
  return err instanceof SystemException;
}

export function isValidationException(err: any): err is ValidationException {
  return err instanceof ValidationException;
}