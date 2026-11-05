import { Response } from 'express';

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function successResponse<T>(res: Response, statusCode: number, message: string, data: T, meta?: PageMeta) {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function errorBody(statusCode: number, message: string, errors?: Record<string, string[]>) {
  return {
    success: false,
    statusCode,
    message,
    ...(errors ? { errors } : {}),
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(res: Response, statusCode: number, message: string, errors?: Record<string, string[]>) {
  return res.status(statusCode).json(errorBody(statusCode, message, errors));
}
