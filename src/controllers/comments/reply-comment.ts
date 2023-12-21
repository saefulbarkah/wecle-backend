import { Request, Response, NextFunction } from 'express';
import { CommentServices } from '../../services/comment-services.js';
import { ApiResponse } from '../../types/index.js';

type request = {
  id: string;
  text: string;
  userId: string;
};
const replyComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, text, userId } = req.body as request;

  try {
    await CommentServices.reply(id, text, userId);
    const response: ApiResponse = {
      status: 201,
      message: 'Reply comment successfully',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default replyComment;
