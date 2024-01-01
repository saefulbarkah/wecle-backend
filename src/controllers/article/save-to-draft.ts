import { Request, Response, NextFunction } from 'express';
import { strUUID } from '../../lib/convert-string.js';
import Article, { ArticleType } from '../../models/article.js';
import { ApiResponse } from '../../types/index.js';
import { Author } from '../../models/author.js';
import { ErrorMessage, ValidationError } from '../../errors/index.js';

type TReq = Pick<ArticleType, 'author' | 'cover' | 'content' | 'title'> & {
  id: string;
};

const saveToDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, author, content, title, cover } = req.body as TReq;

    const slug = strUUID(title);

    const isAuthor = await Author.findOne({ _id: author });
    if (!isAuthor)
      throw new ValidationError(
        ErrorMessage.authorNotExistForArticleCreation()
      );

    const isExistOnDraft = await Article.findOne({
      $and: [{ _id: id }, { author: author }],
    });

    let data = null;
    if (!isExistOnDraft) {
      const result = await Article.create({
        title,
        author,
        content,
        slug,
        cover,
        status: 'DRAFT',
      });
      data = result;
    } else {
      await Article.updateOne(
        { _id: isExistOnDraft._id },
        {
          $set: {
            title,
            content,
            cover,
            status: 'DRAFT',
            updatedAt: Date.now(),
          },
        }
      );
    }
    const response: ApiResponse = {
      message: 'Saving to draft successfully',
      response: 'success',
      status: 201,
      data,
    };

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default saveToDraft;
