import { Socket } from 'socket.io';
import {
  NotificationService,
  notificationType,
} from '../../models/notification.js';
import { UserHandler } from './user-handler.js';

export class NotificationHandler {
  static async send(socket: Socket, data: notificationType) {
    const receiver = UserHandler.getUser(data.receiver);
    if (!receiver) return;
    const notificationData = await NotificationService.create(data);
    const notifDetails = await NotificationService.findOne(
      notificationData._id
    );
    socket
      .to(receiver?.socketId as string)
      .emit('recieve-notification', notifDetails);
  }
}
