import mongoose from 'mongoose';
import { commentType, comments } from '../models/comments.js';

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
    return await comments.findOne({ _id: id });
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
}
