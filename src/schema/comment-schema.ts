import { ZodObject, z } from 'zod';

type comment = {
  userId: z.ZodString;
  text: z.ZodString;
  articleId: z.ZodString;
};

const commentSchema: ZodObject<comment> = z
  .object({
    userId: z.string({ required_error: 'user is required' }),
    text: z.string({ required_error: 'Text is required' }),
    articleId: z.string({ required_error: 'article is required' }),
  })
  .required();

type commentType = z.infer<typeof commentSchema>;

export { commentSchema, commentType };
