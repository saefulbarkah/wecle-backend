import mongoose, { ObjectId } from 'mongoose';
import { NotFoundError, ValidationError } from '../errors/index.js';
import { Author, followSchema } from '../models/author.js';

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
      'followings.author': authorId,
    });
    if (hasFollowed)
      throw new ValidationError('You have followed this author before');

    // push new follower
    const newFollower: followSchema = {
      author: new mongoose.Types.ObjectId(targetAuthor),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    findAuthor.followers.push(newFollower);
    findAuthor.save();

    // push following data
    const newFollowing: Partial<followSchema> = {
      author: new mongoose.Types.ObjectId(authorId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    findTargetAuthor.followings.push(newFollowing);
    findTargetAuthor.save();
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
}
