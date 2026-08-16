import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';
import { generateSeoHtml } from './seo-plugin.js';


// Prefix root-relative public asset paths (/textures, /images, /sounds, /fonts, ...)
// with the deploy base so the site works under a GitHub Pages subpath.
function rootAssetPrefix() {
  let base = '/';
  return {
    name: 'root-asset-prefix',
    configResolved(config) { base = config.base || '/'; },
    transform(code, id) {
      if (base === '/' || base === './' || base === '') return null;
      if (!/\.(jsx?|tsx?|mjs)$/.test(id)) return null;
      if (id.includes('node_modules')) return null;
      const out = code.replace(/(['"`])\/(textures|images|sounds|fonts|cursors|models|audio)\//g, '$1' + base + '$2/');
      return out === code ? null : { code: out, map: null };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/yichang_travel-3D/',
  plugins: [react(), viteCompression(), rootAssetPrefix(), generateSeoHtml()],
  server: {
    proxy: {
      '/sanity-cdn': {
        target: 'https://cdn.sanity.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sanity-cdn/, '')
      }
    }
  }
})
