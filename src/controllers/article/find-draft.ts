import { Request, Response, NextFunction } from 'express';
import Article from '../../models/article.js';
import { ApiResponse } from '../../types/index.js';

const findDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { author_id, id } = req.body;
    const draft = await Article.findOne({
      $and: [{ _id: id }, { author: author_id }, { status: 'DRAFT' }],
    });

    const response: ApiResponse = {
      status: 200,
      response: 'success',
      message: 'Opration  success',
      data: draft,
    };

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default findDraft;
