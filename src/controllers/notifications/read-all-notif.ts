import { NextFunction, Request, Response } from 'express';
import { NotificationService } from '../../models/notification.js';
import { ApiResponse } from '../../types/index.js';

export default async function readAllNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.body as { id: string; userId: string };

  try {
    await NotificationService.readAll(userId);
    const response: ApiResponse = {
      status: 201,
      message: 'Opration success',
      response: 'success',
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
