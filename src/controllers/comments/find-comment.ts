import { NextFunction, Request, Response } from 'express';
import Article from '../../models/article.js';
import { NotFoundError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';
import comments from '../../models/comments.js';
import mongoose from 'mongoose';

type Treq = {
  articleId: string;
};

export default async function findComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const param = req.params as Treq;
    const { articleId } = param;

    // const comment = await comments
    //   .find({ article: articleId })
    //   .populate('article')
    //   .populate({
    //     path: 'user',
    //     select: '_id author',
    //     populate: 'author',
    //   });

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

    const response: ApiResponse = {
      status: 200,
      message: 'Opration success',
      response: 'success',
      data: comment.length !== 0 ? comment : null,
    };

    return res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
