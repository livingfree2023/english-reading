import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const mediaSchema = z.object({
  url: z.url(),
  sourceName: z.string(),
  sourceUrl: z.url(),
  rightsNote: z.string(),
  duration: z.string().optional(),
});

const speeches = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/speeches' }),
  schema: z.object({
    titleZh: z.string(),
    titleEn: z.string(),
    speaker: z.string(),
    year: z.number().int(),
    date: z.string(),
    location: z.string(),
    era: z.string(),
    kind: z.string(),
    status: z.enum(['full', 'excerpt']),
    description: z.string(),
    topics: z.array(z.string()),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    readingTime: z.number().int().positive(),
    sourceName: z.string(),
    sourceUrl: z.url(),
    copyrightStatus: z.enum([
      'us-government-work',
      'historical-public-domain',
      'copyrighted-excerpt',
      'rights-review',
    ]),
    copyrightNote: z.string(),
    audio: mediaSchema.nullable().optional(),
    video: mediaSchema.nullable().optional(),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { speeches };
