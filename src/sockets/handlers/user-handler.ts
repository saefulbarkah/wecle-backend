import mongoose from 'mongoose';

export class UserHandler {
  public static data: {
    receiverId: mongoose.Types.ObjectId;
    socketId: string;
  }[] = [];

  static newUser(receiverId: mongoose.Types.ObjectId, socketId: string) {
    if (!this.data.some((item) => item.socketId === socketId)) {
      this.data.push({ receiverId, socketId });
    }
  }

  static removeUser(socketId: string) {
    this.data = this.data.filter((item) => item.socketId !== socketId);
  }

  static getUser(receiverId: mongoose.Types.ObjectId) {
    return this.data.find((item) => item.receiverId === receiverId);
  }
}
