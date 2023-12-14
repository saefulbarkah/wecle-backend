import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { ValidationError } from '../errors/index.js';

const protectedRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.SECRET_JWT as string);
    const { id } = data as { id: string };
    const findUser = await User.findOne({ _id: id });
    if (!findUser) throw new ValidationError('Invalid Token');
    next();
  } catch (error) {
    res.status(400).json({ error: 'Unauthorized', message: 'Invalid Token' });
  }
};

export default protectedRequest;
