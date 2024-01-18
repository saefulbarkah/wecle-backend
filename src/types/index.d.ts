export type ApiResponse<TData = unknown> = {
  status: 200 | 201 | 204 | 400 | 401 | 404 | 500;
  response: 'success' | 'error';
  message: string;
  error?: any;
  data?: TData;
  totalPage?: number;
  currentPage?: number;
};

export type TPagination<TData = any[]> = {
  nextPage: number | null;
  totalPages: number | null;
  results: TData;
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
