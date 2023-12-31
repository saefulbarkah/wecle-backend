import { NextFunction, Request, Response } from 'express';
import User from '../../models/user.js';
import { ValidationError } from '../../errors/index.js';
import jwt from 'jsonwebtoken';
import { ApiResponse, tokenDecoded } from '../../types/index.js';
import { decodeJWT } from '../../lib/jwt.js';

export default async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // get token
    const { token } = req.body;
    if (!token)
      return res.json({
        message: 'Required token',
        response: 'success',
        data: null,
      } as ApiResponse);

    const data = decodeJWT<tokenDecoded>(
      token,
      process.env.SECRET_JWT as string
    );

    // get user
    const isUser = await User.findOne({ _id: data.id });
    if (!isUser) throw new ValidationError('Unathorization');

    const response: ApiResponse = {
      status: 200,
      message: 'Opration success',
      response: 'success',
      data: {
        ...data,
        token,
      },
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
