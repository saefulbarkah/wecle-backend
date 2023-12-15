import { NextFunction, Request, Response } from 'express';
import { commentSchema, commentType } from '../../schema/comment-schema.js';
import { NotFoundError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';
import { CommentServices } from '../../services/comment-services.js';
import { comments } from '../../models/comments.js';

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentId;

    // validation comment
    const isComment = await CommentServices.findCommentById(commentId);
    if (!isComment)
      throw new NotFoundError(
        'The specified comment does not exist for update'
      );

    const { text } = req.body as commentType;
    const commentTextSchema = commentSchema.pick({ text: true });
    commentTextSchema.parse({ text });

    await CommentServices.updateContentComment(commentId, text);

    const response: ApiResponse = {
      status: 200,
      message: 'Comment updated successfully',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default updateComment;
