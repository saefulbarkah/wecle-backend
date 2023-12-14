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

type ArticleType = InferSchemaType<typeof articleSchema>;

const Article = mongoose.model<ArticleType>('Article', articleSchema);

export default Article;
