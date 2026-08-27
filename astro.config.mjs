import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://modulacao.com', // Replace with real domain when known
  adapter: vercel(),
  integrations: [sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});