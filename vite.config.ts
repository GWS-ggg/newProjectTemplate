import * as path from 'node:path'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import postCssPxToRem from 'postcss-pxtorem'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { AntDesignVueResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import imageminPlugin from 'vite-plugin-imagemin'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  console.log('mode', mode)
  // 加载当前环境的环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
  // base: 'https://ad-static.boomegg.cn/html/gameWebsite/',
    base: env.VITE_BASE_URL,
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement(tag) { return tag.startsWith('swiper-') },
          },
        },
      }),
      UnoCSS(),
      AutoImport({
        resolvers: [ElementPlusResolver(), IconsResolver({
          prefix: 'Icon',
        })],
      }),
      Components({
        resolvers: [
        // Ant Design Vue 4.x 自动按需引入组件
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
          ElementPlusResolver(),
          IconsResolver(),
        ],
      }),
      Icons({
        autoInstall: true,
      }),
      imageminPlugin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 80,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
    resolve: {
    // 设置别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'Assets': path.resolve(__dirname, 'src/assets'),
        'Components': path.resolve(__dirname, 'src/components'),
        'Utils': path.resolve(__dirname, 'src/utils'),
        'Views': path.resolve(__dirname, 'src/views'),
        'Routes': path.resolve(__dirname, 'src/routes'),
        'Config': path.resolve(__dirname, 'src/config'),
        'Plugins': path.resolve(__dirname, 'src/plugins'),
        'Store': path.resolve(__dirname, 'src/store'),
        'Api': path.resolve(__dirname, 'src/api'),
      },
    },
    server: {
      port: 5179, // 本地开发服务端口
      // proxy: {
      //   '/api': {
      //     target: 'https://mprogram-test.forevernine.com/', // 要代理的地址
      //     changeOrigin: true,
      //     followRedirects: true, // Cookie支持重定向
      //     rewrite(path) { return path.replace(/^\/api/, '') },
      //   },
      // },
    },
    // server: {
    // // https: false,
    // // Listening on all local IPs
    //   host: true,
    //   port: 5179,
    //   proxy: {
    //     '/localpay': {
    //       target: 'http://192.168.15.144:8010',
    //       changeOrigin: true,
    //       secure: false,
    //       ws: true,
    //       followRedirects: true,
    //       configure: (proxy, options) => {
    //         proxy.on('error', (err, req, res) => {
    //           console.log('proxy error', err)
    //         })
    //         proxy.on('proxyReq', (proxyReq, req, res) => {
    //           console.log('Sending Request to the Target:', req.method, req.url)
    //         })
    //         proxy.on('proxyRes', (proxyRes, req, res) => {
    //           console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
    //         })
    //       },
    //     },
    //   },
    // },
    build: {
      target: 'ESNext',
      minify: 'esbuild', // 使用 esbuild 进行代码压缩
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
      esbuild: {
        drop: [
          // 'console', // 如果线上需要打印，就把这行注释掉
          'debugger',
        ],
        minify: true, // 启用 esbuild 的 minify 选项
        minifyWhitespace: true, // 移除空白字符
        minifyIdentifiers: true, // 压缩标识符
        minifySyntax: true, // 压缩语法
      },
    },
    esbuild: {
      drop: [
        // 'console', // 如果线上需要打印，就把这行注释掉
        'debugger',
      ],
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
          // 自适应，px>rem转换
            rootValue: 100, // 这里代表的是1rem等于多少rootValue的px。75表示750设计稿，37.5表示375设计稿
            propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
            selectorBlackList: ['norem', 'ignore'], // 过滤掉norem-开头的class，不进行rem转换
            mediaQuery: false, // 允许在媒体查询中转换 px
            exclude(e) {
              // 只有 src/components/header/index.vue 文件被排除
              if (/src\/views\/gameHome/.test(e)) {
                return false
              }
              else {
                return false
              }
            },
          }),
        ],
      },
    },
  }
})
