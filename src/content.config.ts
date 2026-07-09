import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    created: z.coerce.date(), // <--- ИЗМЕНИЛИ ЗДЕСЬ
    updated: z.coerce.date(), // <--- И И ЗДЕСЬ
    publish: z.boolean(),
    km: z.number().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};