import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const music = defineCollection({
	loader: file('src/content/music/data.json'),
	schema: z.object({
		title: z.string(),
		year: z.string(),
		description: z.string(),
		links: z.array(z.object({ label: z.string(), url: z.string() })),
		embedUrl: z.string().optional(),
		image: z.string().optional(),
	}),
});

const art = defineCollection({
	loader: file('src/content/art/data.json'),
	schema: z.object({
		title: z.string(),
		artist: z.string(),
		year: z.string(),
		imageUrl: z.string(),
		note: z.string().optional(),
	}),
});

export const collections = { blog, music, art };
