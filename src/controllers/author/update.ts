import { NextFunction, Request, Response } from 'express';
import { authorSchema, authorType } from '../../schema/auhtor-schema.js';
import { ValidationError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';
import { Author } from '../../models/author.js';

export default async function updateAuthor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id, about, name } = req.body as authorType;
    const updateSchema = authorSchema.pick({ _id: true });
    updateSchema.parse({ _id });

    // validate is avaiable
    const isAuthor = Author.findOne({ _id });
    if (!isAuthor)
      throw new ValidationError(
        'The specified author does not exist for article update.'
      );

    await Author.updateOne(
      { _id },
      {
        $set: {
          about,
          name,
        },
      }
    );

    const response: ApiResponse = {
      status: 200,
      message: 'Author updated successfully',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
