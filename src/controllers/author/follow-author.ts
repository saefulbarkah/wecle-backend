import { Request, Response, NextFunction } from 'express';
import { AuthorService } from '../../services/author-service.js';
import { ApiResponse } from '../../types/index.js';

type requestType = {
  targetAuthor: string;
  author: string;
};

const followAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { targetAuthor, author } = req.body as requestType;

  try {
    await AuthorService.follow(targetAuthor, author);
    const response: ApiResponse = {
      status: 201,
      message: 'Success following',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default followAuthor;
