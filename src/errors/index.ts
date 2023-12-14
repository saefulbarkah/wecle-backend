// validation error
type statusCode = 200 | 201 | 204 | 400 | 401 | 404 | 500;

export class ValidationError extends Error {
  statusCode: statusCode;
  constructor(msg: string) {
    super(msg);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// not found error
export class NotFoundError extends Error {
  statusCode: statusCode;
  constructor(msg: string) {
    super(msg);
    this.name = 'NotFound';
    this.statusCode = 404;
  }
}

// Unathorized
export class UnauthorizedError extends Error {
  statusCode: statusCode;
  constructor(msg: string) {
    super(msg);
    this.name = 'Unauthorized';
    this.statusCode = 401;
  }
}

export class ErrorMessage {
  static authorNotExistForArticleCreation(): string {
    return 'The specified author does not exist for article creation.';
  }
  static authorNotExistForArticleUpdate(): string {
    return 'The specified author does not exist for article update.';
  }
}
