import { NextFunction, Request, Response } from 'express';
import Article from '../../models/article.js';
import { ApiResponse } from '../../types/index.js';
import { NotFoundError } from '../../errors/index.js';

const findArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;
    const data = await Article.findOne({ slug: slug }).populate({
      path: 'author',
    });

    if (!data) {
      throw new NotFoundError('Article not found');
    }
    const response: ApiResponse = {
      message: 'Opration success',
      response: 'success',
      status: 200,
      data: data,
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default findArticle;
