import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../../types/index.js';
import { CommentServices } from '../../services/comment-services.js';

type Treq = {
  articleId: string;
};

export default async function findComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const param = req.params as Treq;
    const { articleId } = param;

    const comment = await CommentServices.findCommentByArticleId(articleId);

    const response: ApiResponse = {
      status: 200,
      message: 'Opration success',
      response: 'success',
      data: comment.length !== 0 ? comment : null,
    };

    return res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
