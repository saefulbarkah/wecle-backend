import mongoose, { InferSchemaType, Schema } from 'mongoose';

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    requird: true,
  },
  content: {
    type: String,
  },
  status: {
    type: String,
    enum: ['DRAFT', 'RELEASE'],
  },
  cover: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
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

export type ArticleType = InferSchemaType<typeof articleSchema> & {
  _id: string;
};

const Article = mongoose.model<ArticleType>('Article', articleSchema);

export default Article;
