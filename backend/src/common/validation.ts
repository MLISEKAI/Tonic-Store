import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from './exceptions/system-exception';

export async function validateDto<T extends object>(
  dtoClass: new () => T,
  plain: any,
  options?: ValidatorOptions,
): Promise<T> {
  const dto = plainToInstance(dtoClass, plain);
  const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true, ...options });
  if (errors.length > 0) {
    throw new ValidationException(flattenValidationErrors(errors));
  }
  return dto;
}

export function flattenValidationErrors(errors: ValidationError[]): any[] {
  return errors.map((error) => ({
    field: error.property,
    errors: Object.values(error.constraints || {}),
  }));
}

export function validateMiddleware<T extends object>(dtoClass: new () => T, options?: ValidatorOptions) {
  return async (req: any, res: any, next: any) => {
    try {
      const validated = await validateDto(dtoClass, req.body, options);
      req.body = validated;
      next();
    } catch (err) {
      if (err instanceof ValidationException) {
        return res.apiValidationError(err.errors);
      }
      next(err);
    }
  };
}

export function validateQueryMiddleware<T extends object>(dtoClass: new () => T, options?: ValidatorOptions) {
  return async (req: any, res: any, next: any) => {
    try {
      const validated = await validateDto(dtoClass, req.query, options);
      req.query = validated;
      next();
    } catch (err) {
      if (err instanceof ValidationException) {
        return res.apiValidationError(err.errors);
      }
      next(err);
    }
  };
}

export function validateParamsMiddleware<T extends object>(dtoClass: new () => T, options?: ValidatorOptions) {
  return async (req: any, res: any, next: any) => {
    try {
      const validated = await validateDto(dtoClass, req.params, options);
      req.params = validated;
      next();
    } catch (err) {
      if (err instanceof ValidationException) {
        return res.apiValidationError(err.errors);
      }
      next(err);
    }
  };
}