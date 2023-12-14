import { Request, Response, NextFunction } from 'express';
import { articleSchema, articleType } from '../../schema/article-schema.js';
import { strUUID } from '../../lib/convert-string.js';
import Article from '../../models/article.js';
import { ApiResponse } from '../../types/index.js';
import { Author } from '../../models/author.js';
import { ErrorMessage, ValidationError } from '../../errors/index.js';

const saveToDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, author, content, title } = req.body as articleType;
    // const customSchema = articleSchema.pick({ author: true });
    // await customSchema.parseAsync({
    //   author,
    // });

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
