import { NextFunction, Request, Response } from 'express';
import { CommentServices } from '../../services/comment-services.js';
import { ApiResponse } from '../../types/index.js';
import { ValidationError } from '../../errors/index.js';
import { UserServices } from '../../services/user-services.js';

const dislikeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, userId } = req.body as {
    id: string;
    userId: string;
  };
  try {
    const isUser = await UserServices.findUserById(userId);
    if (!isUser) throw new ValidationError('User not found');

    const dislike = await CommentServices.dislikeComment(id, userId);

    const response: ApiResponse = {
      status: 201,
      message: dislike.message,
      response: 'success',
      data: null,
    };
    return res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default dislikeComment;
