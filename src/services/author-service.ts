import mongoose, { ObjectId } from 'mongoose';
import { NotFoundError, ValidationError } from '../errors/index.js';
import { Author, followSchema } from '../models/author.js';
import { NotificationService } from '../models/notification.js';

export class AuthorService {
  // follow author
  static async follow(authorId: string, targetAuthor: string) {
    const findAuthor = await Author.findOne({ _id: authorId });
    const findTargetAuthor = await Author.findOne({ _id: targetAuthor });

    if (!findAuthor || !findTargetAuthor) {
      throw new NotFoundError('Author not found');
    }

    // check if has followed before
    const hasFollowed = await Author.findOne({
      _id: authorId,
      'followings.author': targetAuthor,
    });

    if (hasFollowed)
      throw new ValidationError('You have followed this author before');

    // push new follower
    const newFollower: followSchema = {
      author: new mongoose.Types.ObjectId(targetAuthor),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    findAuthor.followings.push(newFollower);
    findAuthor.save();

    // push following data
    const newFollowing: Partial<followSchema> = {
      author: new mongoose.Types.ObjectId(authorId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    findTargetAuthor.followers.push(newFollowing);
    findTargetAuthor.save();

    // push notifications
    NotificationService.create({
      receiver: new mongoose.Types.ObjectId(findTargetAuthor.user!),
      sender: new mongoose.Types.ObjectId(findAuthor.user!),
      message: 'Started following you.',
      targetUrl: authorId,
      type: 'follow',
    });
  }

  // unfollow author
  static async unfollow(authorId: ObjectId, targetAuthor: ObjectId) {
    const findAuthor = await Author.findOne({ _id: authorId });
    const findTargetAuthor = await Author.findOne({ _id: targetAuthor });

    if (!findAuthor || !findTargetAuthor) {
      throw new NotFoundError('Author not found');
    }

    // check if author not followed before
    const followedAuthor = await Author.findOne({
      'followings.author': targetAuthor,
    });

    if (!followedAuthor) {
      throw new ValidationError('You dont have followed this author before');
    }

    findAuthor.followings.pull({ author: targetAuthor });
    findTargetAuthor.followers.pull({ author: authorId });

    // save
    findAuthor.save();
    findTargetAuthor.save();

    return findAuthor;
  }

  // find author by id
  static async findByid(id: string) {
    return await Author.findOne({ _id: id })
      .populate({
        path: 'followers.author',
        select: '_id name avatar createdAt updatedAt',
      })
      .populate({
        path: 'followings.author',
        select: '_id name avatar createdAt updatedAt',
      });
  }
}
