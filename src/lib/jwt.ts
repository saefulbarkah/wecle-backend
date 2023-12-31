import jwt from 'jsonwebtoken';
type responseData = {
  id: string;
  email: string;
  avatar: string;
  token?: string;
};

export const createToken = (data: any) => {
  return jwt.sign(data, process.env.SECRET_JWT as string, {
    expiresIn: '3d',
  });
};

export const decodeJWT = (token: string, secretKey: string) => {
  const decode = jwt.verify(token, secretKey);
  const data = decode as responseData;
  return data;
};
