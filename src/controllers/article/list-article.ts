import { NextFunction, Request, Response } from 'express';
import Article from '../../models/article.js';
import { ApiResponse } from '../../types/index.js';

export default async function listArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { status = 'RELEASE' } = req.query as { status: 'DRAFT' | 'RELEASE' };
  try {
    const data = await Article.find({ status: status }).populate({
      path: 'author',
      populate: {
        path: 'user',
        select: 'name avatar',
      },
    });
    const response: ApiResponse = {
      status: 200,
      message: 'Opration success',
      response: 'success',
      data: data,
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
