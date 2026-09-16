import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkSpeechMarkdown from './src/plugins/remark-speech-markdown.mjs';

export default defineConfig({
  site: 'https://www.booknim.com',
  output: 'static',
  build: { format: 'file' },
  trailingSlash: 'never',
  markdown: {
    processor: unified({ remarkPlugins: [remarkDirective, remarkSpeechMarkdown] }),
  },
});
