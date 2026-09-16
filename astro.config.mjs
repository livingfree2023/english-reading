import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.booknim.com',
  output: 'static',
  build: { format: 'file' },
  trailingSlash: 'never',
});
