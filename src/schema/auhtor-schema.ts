import { z } from 'zod';

const authorSchema = z.object({
  _id: z.string({ required_error: 'id is required' }),
  name: z.string({ required_error: 'name is required' }),
  about: z.string({ required_error: 'about is required' }),
  avatar: z.string().optional(),
});

type authorType = z.infer<typeof authorSchema>;

export { authorType, authorSchema };
