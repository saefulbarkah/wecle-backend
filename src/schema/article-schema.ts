import { z } from 'zod';

const articleSchema = z
  .object({
    id: z.string().optional(),
    title: z.string({ required_error: 'Title is required' }),
    content: z.string({ required_error: 'Content is required' }),
    author: z.string({ required_error: 'Author is required' }),
    status: z.enum(['RELEASE', 'DRAFT'], {
      required_error: `Status is required value 'RELEASE' or 'DRAFT' `,
    }),
    slug: z.string({ required_error: 'Slug is required' }).optional(),
  })
  .required({
    author: true,
    body: true,
    title: true,
    status: true,
  });

type articleType = z.infer<typeof articleSchema>;

export { articleType, articleSchema };
