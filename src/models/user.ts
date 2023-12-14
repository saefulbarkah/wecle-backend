import mongoose, { Schema, InferSchemaType } from 'mongoose';

const userSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
  },
  email: {
    type: String,
    required: true,
  },
  password: {
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

type userType = InferSchemaType<typeof userSchema>;

const User = mongoose.model<userType>('User', userSchema);

export default User;
