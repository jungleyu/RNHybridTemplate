import { defineConfig } from "vite";
import { rnw } from "vite-plugin-rnw";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        rnw({
            jsxRuntime: "automatic",
            include: /\.(js|jsx|ts|tsx)$/,
            babel: {
                presets: ["module:@react-native/babel-preset"],
                plugins: [
                    "@babel/plugin-proposal-export-namespace-from",
                    "react-native-worklets/plugin",
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            'react-native': 'react-native-web',
            'react-native-webview': path.resolve(__dirname, 'src/web-compat/web-view.tsx'),
            '@react-native-vector-icons/material-design-icons': path.resolve(__dirname, 'src/web-compat/material-design-icons.tsx'),
            '@expo/vector-icons/MaterialCommunityIcons': path.resolve(__dirname, 'src/web-compat/material-design-icons.tsx'),
            'react-native-vector-icons/MaterialCommunityIcons': path.resolve(__dirname, 'src/web-compat/material-design-icons.tsx'),
        },
    },
    // 开发服务器配置
    server: {
        proxy: {
            '/coc3': {
                target: 'https://dev.coc.10086.cn/',
                changeOrigin: true,
                configure: (proxy, _) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('Referer', 'https://dev.coc.10086.cn/');
                        console.log('--- 即将转发的请求头 ---');
                        // console.log(proxyReq.getHeaders());
                    });
                },
            },
            '/res/cdn': {
                target: 'https://res.coc.10086.cn/',
                changeOrigin: true,
                configure: (proxy, _) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('Referer', 'https://dev.coc.10086.cn/');
                        proxyReq.setHeader('Origin', 'https://dev.coc.10086.cn/');
                        console.log('--- 即将转发的请求头 ---');
                        console.log(proxyReq.getHeaders());
                    });
                },
            }
        },
        port: 3000,            // 与 Expo Web 一致，也可改为 3000
        open: true,
        // 如果在 WebView 开发时需要允许外部访问，可设置 host: '0.0.0.0'
        host: '0.0.0.0',

    },
    optimizeDeps: {
        include: [
            // 核心框架（Vite 默认已包含，显式声明更安全）
            'react',
            'react-dom',
            'react-native-web',

            // 导航及其依赖
            '@react-navigation/native',
            '@react-navigation/stack',
            'react-native-screens',
            'react-native-safe-area-context',

            // 动画与手势（官方有 Web 实现，必须预构建）
            'react-native-reanimated',
            'react-native-gesture-handler',

            // UI 组件库（基于 RN Web，通常为 CJS 或需转译）
            'react-native-paper',
            '@gorhom/bottom-sheet',
            '@lodev09/react-native-true-sheet',

            // Markdown 渲染（已适配 Web，但可能内部含 CJS）
            'react-native-enriched-markdown',
            'react-native-streamdown',

            // 其他常用 RN 扩展（有 Web 支持）
            'react-native-uuid',
            'react-native-sse',
            'react-native-worklets',

            // 纯 CJS 工具库（不含原生代码，但需要被 ESM 化）
            'crypto-js',
            'js-md5',
            'jsencrypt',
            'lodash.find',
            'axios',
        ],
        exclude: [
            'react-native-webview'
        ]
    },
    assetsInclude: ['assets/*.html'],
    base: mode === 'production' ? '/RNHybridTemplate/' : '/',
    build: {
        outDir: './dist-web',
        sourcemap: false,                    // 生产环境不生成 sourcemap（若需要可设 true）
        minify: 'terser',                // 使用字符串形式
        terserOptions: {
            compress: {
                drop_console: false,         // 生产可改 true
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.debug'],
                passes: 2,
            },
            mangle: {
                safari10: true,
            },
            format: {
                comments: false,
                ecma: 2020,
            },
            ecma: 2020,
            module: true,
        } as any,
        target: 'es2015',                    // 兼容性目标
        cssCodeSplit: false,                 // 对 RN Web 项目建议 false，防止样式丢失
        rollupOptions: {
            output: {
                // 手动分割 chunk（可选）
                manualChunks(id) {
                    if (id.includes('node_modules/react-native-web')) return 'rnw';
                    if (id.includes('node_modules/react')) return 'react';
                    if (id.includes('node_modules/@react-navigation')) return 'navigation';
                    if (id.includes('node_modules/react-native-reanimated')) return 'reanimated';
                },
            },
        }
    },
    // 预览服务器配置（与开发代理类似，但仅用于静态文件服务）
    preview: {
        port: 4173,
        open: true,
    },
}));