import { NextFunction, Request, Response } from 'express';
import Article from '../../models/article.js';
import { NotFoundError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';

export default async function deleteArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.body as { id: string };
    const deleteResult = await Article.deleteOne({ _id: id });

    // check if not deleted
    if (deleteResult.deletedCount === 0) {
      throw new NotFoundError(
        'The specified article does not exist for deletion'
      );
    }
    const response: ApiResponse = {
      status: 201,
      message: 'Article deleted successfully',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
