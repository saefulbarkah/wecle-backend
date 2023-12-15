import mongoose, { InferSchemaType, Schema } from 'mongoose';

const replySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
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

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  replies: [replySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

type ReplyType = InferSchemaType<typeof replySchema> & {
  _id: string;
};
type commentType = InferSchemaType<typeof commentSchema> & {
  _id: string;
};

const comments = mongoose.model<commentType>('Comment', commentSchema);

export { comments, ReplyType, commentType };
