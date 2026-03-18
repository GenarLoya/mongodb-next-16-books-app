export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  static status = 404;

  constructor(message: string) {
    super(message, NotFoundError.status);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApiError {
  static status = 409;

  constructor(message: string) {
    super(message, ConflictError.status);
    this.name = "ConflictError";
  }
}
