import { NextFunction, Request, Response } from 'express';
import Article from '../../models/article.js';
import { ApiResponse, TPagination } from '../../types/index.js';
import mongoose, { Number } from 'mongoose';

type RequestType = {
  status: 'DRAFT' | 'RELEASE';
  authorId: string;
  limit: number;
  page: string;
};

export default async function listArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const query = req.query as unknown as RequestType;
  const {
    status = 'RELEASE',
    authorId = undefined,
    limit = 5,
    page: pageString = 1,
  } = query;
  const page = parseInt(pageString as string);
  const itemsPerPage = limit * 1;
  const skip = (page - 1) * limit;

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
      {
        $skip: skip,
      },
      {
        $limit: itemsPerPage * 1,
      },
    ]);
    const countData = await Article.countDocuments();

    const totalPages = Math.ceil(countData / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    const response: ApiResponse<TPagination> = {
      status: 200,
      message: 'Opration success',
      response: 'success',
      data: {
        totalPages,
        nextPage,
        results: data,
      },
    };

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
