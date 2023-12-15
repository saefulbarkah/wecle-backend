import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';
import { CommentServices } from '../../services/comment-services.js';

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.commentId;
    const result = await CommentServices.deleteCommentById(id);

    // check if has deleted
    if (result.deletedCount === 0)
      throw new NotFoundError(
        'The specified comment does not exist for deletion.'
      );

    const response: ApiResponse = {
      status: 201,
      message: 'Comment deleted successfully',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default deleteComment;
