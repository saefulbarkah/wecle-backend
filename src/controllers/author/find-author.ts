import { NextFunction, Request, Response } from 'express';
import { AuthorService } from '../../services/author-service.js';
import { ApiResponse } from '../../types/index.js';

const findAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const { authorId } = req.params;
  try {
    const data = await AuthorService.findByid(authorId);
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

export default findAuthor;
