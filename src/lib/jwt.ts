import jwt from 'jsonwebtoken';

export const createToken = (data: any) => {
  return jwt.sign(data, process.env.SECRET_JWT as string, {
    expiresIn: '3d',
  });
};
