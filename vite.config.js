import * as path from 'node:path';
import process from 'node:process';
import vue from '@vitejs/plugin-vue';
import postCssPxToRem from 'postcss-pxtorem';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { AntDesignVueResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import imageminPlugin from 'vite-plugin-imagemin';
// https://vite.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    console.log('mode', mode);
    // 加载当前环境的环境变量
    var env = loadEnv(mode, process.cwd(), '');
    return {
        // base: 'https://ad-static.boomegg.cn/html/gameWebsite/',
        base: env.VITE_BASE_URL,
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: function (tag) { return tag.startsWith('swiper-'); },
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
            // 使用 vite-plugin-imagemin 压缩图片
            imageminPlugin({
                // 没有 filter 参数，移除此项
                gifsicle: {
                    optimizationLevel: 7,
                    interlaced: false,
                },
                optipng: {
                    optimizationLevel: 5,
                },
                mozjpeg: {
                    quality: 75,
                    progressive: true,
                },
                pngquant: {
                    quality: [0.7, 0.8],
                    speed: 6,
                },
                svgo: {
                    plugins: [
                        {
                            name: 'removeViewBox',
                            active: false, // 保留viewBox以保持SVG缩放能力
                        },
                        {
                            name: 'removeEmptyAttrs',
                            active: false,
                        },
                        {
                            name: 'cleanupIDs',
                            active: true,
                        },
                    ],
                },
                // 为WebP格式添加支持
                webp: {
                    quality: 75,
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
            assetsInlineLimit: 4096, // 4kb以下的图片会被转为base64
            // 优化 Chunk 大小
            chunkSizeWarningLimit: 1000, // 提高警告阈值
            rollupOptions: {
                output: {
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: '[ext]/[name]-[hash].[ext]',
                    manualChunks: function (id) {
                        // 将 node_modules 中的代码单独打包
                        if (id.includes('node_modules')) {
                            // 可以根据包名再次分割
                            var packageName = id.toString().split('node_modules/')[1].split('/')[0];
                            // 一些大型库单独分包
                            if (['vue', 'vue-router', 'pinia'].includes(packageName)) {
                                return "vendor-".concat(packageName);
                            }
                            return 'vendor'; // 其他依赖打包成一个 vendor 文件
                        }
                        // 添加图片资源分组
                        if (id.includes('/assets/images/')) {
                            return 'images';
                        }
                    },
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
                        exclude: function (e) {
                            // 只有 src/components/header/index.vue 文件被排除
                            if (/src\/views\/gameHome/.test(e)) {
                                return false;
                            }
                            else {
                                return false;
                            }
                        },
                    }),
                ],
            },
        },
    };
});
