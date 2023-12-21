import mongoose from 'mongoose';
import { ReplyType, commentType, comments } from '../models/comments.js';
import { NotFoundError } from '../errors/index.js';
import { NotificationService } from '../models/notification.js';

export class CommentServices {
  static async createNewComment(
    articleId: string,
    text: string,
    userId: string
  ) {
    return await comments.create({
      article: articleId,
      text,
      user: userId,
    });
  }
  static async findCommentById(id: string) {
    return await comments.findOne({ _id: id }).populate('article');
  }
  static async deleteCommentById(id: string) {
    return await comments.deleteOne({ _id: id });
  }
  static async updateContentComment(id: string, text: string) {
    await comments.updateOne(
      { _id: id },
      {
        $set: {
          text,
          updatedAt: Date.now(),
        },
      }
    );
  }
  static async findCommentByArticleId(
    articleId: string
  ): Promise<commentType[]> {
    const comment = await comments
      .aggregate([
        {
          $match: { article: new mongoose.Types.ObjectId(articleId) },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $lookup: {
            from: 'authors',
            localField: 'userDetails.author',
            foreignField: '_id',
            as: 'authorDetails',
          },
        },
        {
          $project: {
            _id: 1,
            article: 1,
            user: {
              _id: '$userDetails._id',
              author_id: { $arrayElemAt: ['$authorDetails._id', 0] },
              name: { $arrayElemAt: ['$authorDetails.name', 0] },
              avatar: { $arrayElemAt: ['$authorDetails.avatar', 0] },
              // Add other fields from 'authorDetails' if needed
            },
            likes: 1,
            text: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
            // Add other fields you want to include from the comments collection
          },
        },
      ])
      .sort({ updatedAt: -1 });
    return comment;
  }
  static async dislikeComment(id: string, userId: string) {
    const dislikeComment = await comments.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          likes: { _id: userId },
        },
      }
    );

    const message = 'Dislike comment success';
    return { response: dislikeComment, message };
  }
  static async likeComment(id: string, userId: string) {
    const isLiked = await comments.findOne({ 'likes._id': userId, _id: id });
    const isComment = await this.findCommentById(id);

    // validation
    if (!isComment) throw new NotFoundError('Comment not found');
    if (isLiked) {
      return await this.dislikeComment(id, userId);
    }

    const commentLike = await comments.updateOne(
      { _id: id },
      {
        $push: {
          likes: { _id: userId },
        },
      }
    );

    const message = 'Like comment success';

    return { response: commentLike, message };
  }

  // Reply comment
  static async reply(id: string, text: string, userId: string) {
    const comment = await comments.findById(id);
    if (!comment) throw new NotFoundError('Comment not found');
    const reply = {
      text: text,
      user: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    comment.replies.push(reply);
    await comment.save();

    const findReplier = comment.replies.find((item) =>
      item.user.equals(userId)
    );

    // push notification when reply comment
    if (!findReplier?.user.equals(comment.user)) {
      NotificationService.create({
        sender: new mongoose.Types.ObjectId(userId),
        receiver: comment.user,
        message: 'Reply your comment.',
        type: 'comment',
        targetUrl: comment.article.toString(),
      });
    }
  }
}
