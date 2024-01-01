import { NextFunction, Request, Response } from 'express';
import { articleSchema } from '../../schema/article-schema.js';
import Article, { ArticleType } from '../../models/article.js';
import { nanoid } from 'nanoid';
import { toCapitalizeString, toSlug } from '../../lib/convert-string.js';
import { ValidationError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';
import { Author } from '../../models/author.js';

type TReq = Pick<ArticleType, 'author' | 'cover' | 'content' | 'title'> & {
  id: string;
};

const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { author, content, title, cover } = req.body as TReq;
    articleSchema.parse({ author, content, title });

    // validation
    const isAuthor = await Author.findOne({ _id: author });
    if (!isAuthor)
      throw new ValidationError(
        'The specified author does not exist for article creation.'
      );

    // make slug
    const randomizer = nanoid(10);
    const capTitle = toCapitalizeString(title);
    const slug = `${toSlug(capTitle)}-${randomizer}`;

    await Article.create({ author, content, title, slug, cover });
    const response: ApiResponse = {
      status: 201,
      message: 'Article created successfully',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default createArticle;
