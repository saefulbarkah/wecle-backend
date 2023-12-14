import { NextFunction, Request, Response } from 'express';
import { NotificationService } from '../../models/notification.js';
import { ApiResponse } from '../../types/index.js';

export default async function getNotif(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const param = req.params as { receiverId: string };

  try {
    const data = await NotificationService.findByUserId(param.receiverId);
    const response: ApiResponse = {
      status: 200,
      message: 'Opration success',
      response: 'success',
      data: data,
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}
