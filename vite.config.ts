import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const appVersion = packageJson.version || '0.1.0';

export default defineConfig(({ mode }) => {
  const isDebug = mode === 'debug' || process.env.BUILD_MODE === 'debug';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      sourcemap: isDebug,
      minify: isDebug ? false : 'esbuild',
      cssMinify: !isDebug,
    },
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(isDebug ? 'debug' : 'production'),
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
      'import.meta.env.VITE_APP_BUILD_TYPE': JSON.stringify(isDebug ? 'Debug' : 'Release'),
      '__APP_VERSION__': JSON.stringify(appVersion),
      '__APP_BUILD_TYPE__': JSON.stringify(isDebug ? 'Debug' : 'Release'),
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : { ignored: ['**/adhigam-ias-v*.zip'] },
    },
  };
});
