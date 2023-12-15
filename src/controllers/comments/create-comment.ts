import { NextFunction, Request, Response } from 'express';
import { commentType } from '../../schema/comment-schema.js';
import Article from '../../models/article.js';
import User from '../../models/user.js';
import { ValidationError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';
import { CommentServices } from '../../services/comment-services.js';

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { articleId, text, userId } = req.body as commentType;
  try {
    // validation
    const isUser = await User.findOne({ _id: userId });
    const isArticle = await Article.findOne({ _id: articleId });
    if (!isUser)
      throw new ValidationError(
        'The specified user does not exist for comment creation.'
      );
    if (!isArticle)
      throw new ValidationError(
        'The specified article does not exist for comment creation.'
      );

    // process to create comment
    const comment = await CommentServices.createNewComment(
      articleId,
      text,
      userId
    );
    // update comment id
    await Article.updateOne(
      { _id: articleId },
      { $push: { comments: comment._id } }
    );
    const response: ApiResponse = {
      status: 201,
      message: 'Comment created successfully',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default createComment;
