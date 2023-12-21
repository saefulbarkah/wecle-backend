import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import { AuthorService } from '../../services/author-service.js';
import { ApiResponse } from '../../types/index.js';

type TRequest = {
  author: ObjectId;
  targetAuthor: ObjectId;
};

const unfollowAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { author, targetAuthor } = req.body as TRequest;

  try {
    await AuthorService.unfollow(author, targetAuthor);
    const response: ApiResponse = {
      status: 201,
      response: 'success',
      message: 'Unfollow success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default unfollowAuthor;
