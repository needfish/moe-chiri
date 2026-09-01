// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';

import rehypeFigure from './src/plugins/rehype-figure.mjs';
import rehypeRuninPeriod from './src/plugins/rehype-runin-period.mjs';

export default defineConfig({
  site: 'https://kitan.moe',
  markdown: {
    shikiConfig: {
      theme: 'ayu-dark',
    },
    processor: unified({
      rehypePlugins: [rehypeFigure, rehypeRuninPeriod],
    }),
  },
  integrations: [mdx(), sitemap()],
});
