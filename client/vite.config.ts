import { fileURLToPath, URL } from 'node:url'
import { defineConfig, ConfigEnv, UserConfig, loadEnv } from 'vite'
import { getEnv } from './build/getEnv'
import { createVitePlugins } from './build/createVitePlugins'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // process.cwd()获取当前node进程所在的地址
  const env = loadEnv(mode, process.cwd())
  const viteEnv = getEnv(env)

  return {
    plugins: createVitePlugins(viteEnv),
    base: '/',
    // 配置前端服务地址和端口
    server: {
      host: '0.0.0.0',
      port: viteEnv.VITE_PORT,
      proxy: {
        '/api': {
          target: 'http://localhost:8182',
          changeOrigin: true, // 允许跨域,
          rewrite: (path) => path.replace('/api', '')
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      outDir: 'dist',
      // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: viteEnv.VITE_DROP_CONSOLE_AND_DEBUGGER,
          drop_debugger: true
        }
      },
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: true,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  }
})
