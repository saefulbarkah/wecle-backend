import jwt from 'jsonwebtoken';

export const createToken = (data: any) => {
  return jwt.sign(data, process.env.SECRET_JWT as string);
};

type DecodedData<T> = T;
export const decodeJWT = <T extends { [key: string]: any }>(
  token: string,
  secretKey: string
): DecodedData<T> => {
  const decode = jwt.verify(token, secretKey);
  const data = decode as T;
  return data;
};
