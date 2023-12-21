import mongoose, { Schema, InferSchemaType } from 'mongoose';

const followSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
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

const authorSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: String,
  about: String,
  avatar: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  followings: [followSchema],
  followers: [followSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

type TAuthor = InferSchemaType<typeof authorSchema>;

const Author = mongoose.model<TAuthor>('Author', authorSchema);

type followSchema = InferSchemaType<typeof followSchema>;

export { Author, TAuthor, followSchema };
