import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// Określamy adapter w zależności od docelowej platformy
let adapter;
if (import.meta.env.PUBLIC_DEPLOY_TARGET === 'netlify') {
  const netlify = await import('@astrojs/netlify/functions');
  adapter = netlify.default();
} else if (import.meta.env.PUBLIC_DEPLOY_TARGET === 'vercel') {
  const vercel = await import('@astrojs/vercel/serverless');
  adapter = vercel.default();
} else {
  adapter = node({
    mode: 'standalone',
  });
}

export default defineConfig({
  integrations: [
    vue(),
    tailwind(),
  ],
  output: 'server',  // Używamy trybu hybrydowego zamiast server
  adapter: adapter,
  vite: {
    ssr: {
      noExternal: ['firebase', '@firebase/*'],
    },
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
    },
    server: {
      fs: {
        // Rozszerzone opcje, aby uniknąć problemów z dostępem do plików
        allow: ['..'],
      },
    },
  },
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});