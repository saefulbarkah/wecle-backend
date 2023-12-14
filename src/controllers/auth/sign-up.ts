import { Response, Request, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';
import { ValidationError } from '../../errors/index.js';
import { ApiResponse } from '../../types/index.js';
import { Author } from '../../models/author.js';

type Tuser = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

const userSchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Password is required' })
      .email({ message: 'Must be email' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password minium 6 character' }),
  })
  .required({
    name: true,
    password: true,
    email: true,
  });

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body as Tuser;
  try {
    userSchema.parse({ email, name, password });

    // check if email already use
    const user = await User.findOne({ email });
    if (user) throw new ValidationError('email is already use');

    // hash password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashPassword = await bcrypt.hash(password, salt);

    // generate avatar
    const encodeURL = encodeURIComponent(name);
    const newAvatar = `https://ui-avatars.com/api/?name=${encodeURL}`;

    // create new user
    const newUser = await User.create({
      email: email,
      password: hashPassword,
      author: null,
    });

    // create new author
    const auhtor = await Author.create({
      name: name,
      avatar: newAvatar,
      about: null,
      user: newUser._id,
    });

    // update author on user
    await User.updateOne(
      { _id: newUser._id },
      {
        author: auhtor._id,
      }
    );

    const response: ApiResponse = {
      status: 201,
      response: 'success',
      message: 'Register succesfully',
    };

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default signUp;
