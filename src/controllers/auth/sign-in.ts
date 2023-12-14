import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';
import { createToken } from '../../lib/jwt.js';
import { z } from 'zod';
import { NotFoundError, ValidationError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';
import { TAuthor } from '../../models/author.js';

type Tuser = {
  email: string;
  password: string;
};

const loginSchema = z
  .object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
  })
  .required();

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as Tuser;

  try {
    // parse schema
    loginSchema.parse({ email, password });

    // check if any user
    const user = await User.findOne({ email: email }).populate<{
      author: TAuthor;
    }>('author');
    if (!user) throw new NotFoundError('Invalid Credentials');

    // validation password
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new ValidationError('Email or password incorrect');
    }

    // create token
    const tokenStore = {
      id: user._id,
      email: user.email,
      name: user.author.name,
      avatar: user.author.avatar,
      author_id: user.author._id,
    };
    const token = createToken(tokenStore);
    const response: ApiResponse = {
      status: 200,
      message: 'Welcome back, ' + user.author.name + '!',
      response: 'success',
      data: { token },
    };
    res.cookie('auth', token, {
      secure: true,
      httpOnly: true,
      maxAge: 51251516 * 1000,
      sameSite: 'none',
    });
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default signIn;
