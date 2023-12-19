import Article from '../models/article.js';
import { TAuthor } from '../models/author.js';

export class ArticleServices {
  static async findArticleById(id: string) {
    return await Article.findOne({ _id: id }).populate<{ author: TAuthor }>({
      path: 'author',
      populate: {
        path: 'user',
        select: '_id name email avatar createdAt updatedAt',
      },
    });
  }
}
