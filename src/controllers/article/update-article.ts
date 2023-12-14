import { NextFunction, Request, Response } from 'express';
import { articleSchema } from '../../schema/article-schema.js';
import Article from '../../models/article.js';
import { nanoid } from 'nanoid';
import { toCapitalizeString, toSlug } from '../../lib/convert-string.js';
import { ValidationError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';
import { Author } from '../../models/author.js';

const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = req.params.id;
    const { content, title, author, status } = req.body;
    const customSchema = articleSchema.pick({ author: true });
    await customSchema.parseAsync({ author });

    // validation before update
    const isAuthor = await Author.findOne({ _id: author });
    const isArticle = await Article.findOne({ _id: articleId });
    if (!isAuthor)
      throw new ValidationError(
        'The specified author does not exist for article update.'
      );
    if (!isArticle)
      throw new ValidationError(
        'The specified article does not exist for article update.'
      );

    // make slug
    let slug;
    if (title) {
      const randomizer = nanoid(10);
      const capTitle = toCapitalizeString(title);
      slug = `${toSlug(capTitle)}-${randomizer}`;
    }

    await Article.updateOne(
      { _id: articleId },
      { content, title, slug, status, updatedAt: Date.now() }
    );

    const response: ApiResponse = {
      status: 201,
      message: 'Article updated successfully',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default updateArticle;
