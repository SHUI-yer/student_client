import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // 允许的内网穿透域名（如果不需要可注释掉或删除）
    // allowedHosts: [
    //   'localhost'
    // ]
  }
})
