import { Response } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '../types/index.js';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../errors/index.js';

const errorHandling = (error: Error, res: Response) => {
  let response: ApiResponse;

  switch (true) {
    case error instanceof ZodError:
      const errorMsg = (error as ZodError).issues.map((item) => {
        return {
          message: item.message,
          field: item.path[0],
        };
      });
      response = {
        status: 400,
        response: 'error',
        message: 'Invalid request',
        error: errorMsg,
      };
      res.status(response.status).json(response);
      break;

    case error instanceof NotFoundError:
      const err = error as NotFoundError;
      response = {
        status: 404,
        response: 'error',
        message: err.message,
        error: true,
        data: null,
      };
      res.status(response.status).json(response);
      break;

    case error instanceof ValidationError:
      const validationError = error as NotFoundError;
      response = {
        status: validationError.statusCode,
        response: 'error',
        message: validationError.message,
        error: true,
        data: null,
      };
      res.status(response.status).json(response);
      break;

    case error instanceof UnauthorizedError:
      const unauthorizedError = error as UnauthorizedError;
      response = {
        status: unauthorizedError.statusCode,
        response: 'error',
        message: unauthorizedError.message,
        error: true,
        data: null,
      };
      res.status(response.status).json(response);
      break;

    default:
      response = {
        response: 'error',
        status: 500,
        message: 'Internal server error',
        error: true,
        data: null,
      };
      res.status(response.status).json(response);
      break;
  }
};

export default errorHandling;
