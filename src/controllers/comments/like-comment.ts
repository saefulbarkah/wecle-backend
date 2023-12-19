import { NextFunction, Request, Response } from 'express';
import { CommentServices } from '../../services/comment-services.js';
import { ApiResponse } from '../../types/index.js';
import { UserServices } from '../../services/user-services.js';
import { ValidationError } from '../../errors/index.js';
import { NotificationService } from '../../models/notification.js';
import { ArticleServices } from '../../services/article-services.js';
import mongoose from 'mongoose';

const likeComment = async (req: Request, res: Response, next: NextFunction) => {
  const { id, userId } = req.body as {
    id: string;
    userId: string;
  };
  try {
    const isUser = await UserServices.findUserById(userId);
    if (!isUser) throw new ValidationError('User not found');

    const like = await CommentServices.likeComment(id, userId);

    // const comment = await CommentServices.findCommentById(id);
    // const article = await ArticleServices.findArticleById(
    //   String(comment?.article._id)
    // );

    // await NotificationService.create({
    //   sender: new mongoose.Types.ObjectId(userId),
    //   receiver: new mongoose.Types.ObjectId(
    //     article?.author.user?._id.toString()
    //   ),
    //   message: 'Like your comment',
    //   targetUrl: '',
    // });

    const response: ApiResponse = {
      status: 201,
      message: like.message,
      response: 'success',
      data: null,
    };
    return res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default likeComment;
