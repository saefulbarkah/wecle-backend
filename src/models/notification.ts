import { Schema, model, InferSchemaType } from 'mongoose';

const notificationSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
  targetUrl: {
    type: String,
  },
  readAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export interface notificationType
  extends InferSchemaType<typeof notificationSchema> {
  _id: string;
}

const Notification = model<notificationType>(
  'Notification',
  notificationSchema
);

export class NotificationService {
  // create notification
  static async create(data: notificationType): Promise<notificationType> {
    const created = await Notification.create({
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      targetUrl: data.targetUrl,
    });
    return created;
  }

  // find one notification
  static async findOne(id: string) {
    const response = await Notification.findOne({ _id: id })
      .populate({
        path: 'sender',
        populate: {
          path: 'author',
          select: '_id name avatar createdAt updatedAt',
        },
        select: '_id email author createdAt updatedAt',
      })
      .populate({
        path: 'receiver',
        populate: {
          path: 'author',
          select: '_id name avatar createdAt updatedAt',
        },
        select: '_id email author createdAt updatedAt',
      });
    return response;
  }

  // find notification by user id
  static async findByUserId(user_id: string) {
    const response = await Notification.find({ receiver: user_id })
      .populate({
        path: 'sender',
        populate: {
          path: 'author',
          select: '_id name avatar createdAt updatedAt',
        },
        select: '_id email author createdAt updatedAt',
      })
      .populate({
        path: 'receiver',
        populate: {
          path: 'author',
          select: '_id name avatar createdAt updatedAt',
        },
        select: '_id email author createdAt updatedAt',
      })
      .sort({ createdAt: -1 });
    return response;
  }

  // read all notification
  static async readAll(userId: string) {
    const response = await Notification.updateMany(
      { receiver: userId, readAt: { $exists: false } },
      { $set: { readAt: new Date() } }
    );
    return response;
  }

  // read one notification
  static async readOne(id: string, userId: string) {
    const response = await Notification.findOneAndUpdate(
      { _id: id, receiver: userId },
      {
        $set: {
          readAt: new Date(),
        },
      }
    );
    return response;
  }
}
