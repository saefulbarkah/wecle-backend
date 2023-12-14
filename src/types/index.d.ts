export type ApiResponse = {
  status: 200 | 201 | 204 | 400 | 401 | 404 | 500;
  response: 'success' | 'error';
  message: string;
  error?: any;
  data?: any;
};
