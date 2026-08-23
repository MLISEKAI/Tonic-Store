export interface ApiResponse<T = any> {
  error: boolean;
  code: number;
  message: string;
  data: T | null;
  traceId: string;
}

export const ApiResponseHelper = {
  success<T>(data: T | null = null, message = 'success', code = 200): ApiResponse<T | null> {
    return { error: false, code, message, data, traceId: '' };
  },

  error(message = 'error', code = 500901, data = null): ApiResponse<null> {
    return { error: true, code, message, data, traceId: '' };
  },

  validationError(errors: any[], message = 'Validation failed'): ApiResponse<any[]> {
    return { error: true, code: 400111, message, data: errors, traceId: '' };
  },
};

declare global {
  namespace Express {
    interface Response {
      apiSuccess<T>(data: T | null, message?: string, code?: number): this;
      apiError(message: string, code?: number, data?: any): this;
      apiValidationError(errors: any[], message?: string): this;
    }
  }
}

export function attachApiResponseHelpers(req: any, res: any, next: any) {
  const traceId = req.headers['x-trace-id'] || req.id || '';
  res.apiSuccess = function <T>(data: T | null = null, message = 'success', code = 200) {
    return this.status(code).json({ error: false, code, message, data, traceId });
  };
  res.apiError = function (message = 'error', code = 500901, data: any = null) {
    return this.status(Math.floor(code / 1000) || 500).json({ error: true, code, message, data, traceId });
  };
  res.apiValidationError = function (errors: any[], message = 'Validation failed') {
    return this.status(400).json({ error: true, code: 400111, message, data: errors, traceId });
  };
  next();
}

export { attachApiResponseHelpers as traceMiddleware };