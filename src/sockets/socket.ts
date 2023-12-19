import { Server } from 'http';
import { Server as SocketIoServer } from 'socket.io';
import { notificationType } from '../models/notification.js';
import { NotificationHandler } from './handlers/notification-handler.js';
import { UserHandler } from './handlers/user-handler.js';
import dotenv from 'dotenv';
dotenv.config();

export function createSocketIo(server: Server) {
  const io = new SocketIoServer(server, {
    cors: {
      origin: '*',
      methods: ['POST', 'GET'],
    },
  });

  io.on('connection', (socket) => {
    console.log('socket connected');

    socket.on('new-user', (receiverId) => {
      UserHandler.newUser(receiverId, socket.id);
    });

    socket.on('send-notification', (data: notificationType) =>
      NotificationHandler.send(socket, data)
    );

    socket.on('disconnect', () => {
      UserHandler.removeUser(socket.id);
    });
  });
}
