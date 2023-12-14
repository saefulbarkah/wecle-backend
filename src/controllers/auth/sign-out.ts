import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../../types/index.js';

const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('auth');
    const response: ApiResponse = {
      status: 200,
      message: 'Logout successfuly',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default signOut;
