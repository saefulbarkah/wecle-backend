import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../../types/index.js';
import { UnauthorizedError, ValidationError } from '../../errors/index.js';
import User from '../../models/user.js';
import { TAuthor } from '../../models/author.js';

const Me = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies.auth;
  try {
    if (!authToken) throw new UnauthorizedError('Required token');
    const decode = jwt.verify(authToken, process.env.SECRET_JWT as string);
    const { id } = decode as { id: string };
    const user = await User.findOne({ _id: id }).populate<{ author: TAuthor }>(
      'author'
    );
    if (!user) throw new ValidationError('Invalid Token');

    const response: ApiResponse = {
      status: 200,
      message: 'Opration success',
      response: 'success',
      data: {
        id: user._id,
        name: user.author.name,
        email: user.email,
        avatar: user.author.avatar,
        author_id: user.author._id,
        token: authToken,
      },
    };

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default Me;
