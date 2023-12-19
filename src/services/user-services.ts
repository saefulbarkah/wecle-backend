import User from '../models/user.js';

export class UserServices {
  static async findUserById(id: string) {
    return await User.findOne({ _id: id });
  }
}
