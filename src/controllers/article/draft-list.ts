import { Response, Request, NextFunction } from 'express';
import { articleType } from '../../schema/article-schema.js';
import Article from '../../models/article.js';
import { ValidationError } from '../../errors/index.js';
import { Author } from '../../models/author.js';
import { ApiResponse } from '../../types/index.js';

const draftLists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { author_id } = req.body;
    const author = await Author.findOne({ _id: author_id });
    if (!author) throw new ValidationError('Invalid Author');

    const data = await Article.find({ author: author._id, status: 'DRAFT' });

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
};

export default draftLists;
