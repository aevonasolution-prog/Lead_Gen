export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
export class ValidationError extends AppError {
  constructor(errors: Record<string, string[]>, message = 'Validation failed. Please check the highlighted fields.') {
    super(400, message, errors);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, message);
  }
}
export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(403, message);
  }
}
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}
