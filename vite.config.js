import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    // 允许使用 React dev server 并构建 React 应用
    react(),
    // Allows using self-signed certificates to run the dev server using HTTPS.
    // 这可以帮助本地开发时使用 HTTPS，但在 Vercel 上不需要启用
    // basicSsl()
  ],

  publicDir: './public',
  server: {
    host: true, // 启用本地网络访问
    // Vercel 会自动处理 https，所以在生产环境无需启用 https: true
  },
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), './src'),
    }
  },
});
