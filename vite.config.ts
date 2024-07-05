import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import ElementPlus from 'unplugin-element-plus/vite';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), ElementPlus({})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
