import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Наш умный переводчик дат
const flexibleDate = z.preprocess((val) => {
  if (typeof val === 'string') {
    // Ищем формат ДД-ММ-ГГГГ и переворачиваем в ГГГГ-ММ-ДД, сохраняя время (T...)
    const corrected = val.replace(/^(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1');
    return corrected;
  }
  return val;
}, z.coerce.date()); // После переворота превращаем в дату

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    created: flexibleDate, // <--- Используем наш переводчик!
    updated: flexibleDate, // <--- Используем наш переводчик!
    publish: z.boolean(),
    km: z.coerce.number().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};