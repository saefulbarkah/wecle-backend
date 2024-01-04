export type ApiResponse = {
  status: 200 | 201 | 204 | 400 | 401 | 404 | 500;
  response: 'success' | 'error';
  message: string;
  error?: any;
  data?: any;
  totalPage?: number;
  currentPage?: number;
};

export type tokenDecoded = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  token: string;
  author_id: string;
  exp: number;
  iat: number;
};
