import { NextFunction, Request, Response } from 'express';
import Article from '../../models/article.js';
import { ApiResponse } from '../../types/index.js';
import mongoose from 'mongoose';

export default async function listArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { status = 'RELEASE', authorId = undefined } = req.query as {
    status: 'DRAFT' | 'RELEASE';
    authorId: string;
  };
  try {
    const data = await Article.aggregate([
      {
        $match: {
          status: status,
          ...(authorId && {
            author: new mongoose.Types.ObjectId(authorId),
          }),
        },
      },
      {
        $lookup: {
          from: 'authors',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          slug: 1,
          status: 1,
          cover: 1,
          'author._id': 1,
          'author.name': 1,
          'author.avatar': 1,
          'author.createdAt': 1,
          'author.updatedAt': 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    // const data = await Article.find({
    //   status: status,
    //   author: authorId,
    // }).populate({
    //   path: 'author',
    //   populate: {
    //     path: 'user',
    //     select: 'name avatar',
    //   },
    // });
    const response: ApiResponse = {
      status: 200,
      message: 'Opration success',
      response: 'success',
      data: data,
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
