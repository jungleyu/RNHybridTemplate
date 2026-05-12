import { defineConfig } from "vite";
import { rnw } from "vite-plugin-rnw";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
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
    base: '/RNHybridTemplate/',
    optimizeDeps: {
        include: [
            'react-native-web',
            'react-native-webview',
            'react-native-gesture-handler'
        ],
    },
    assetsInclude: ['assets/*.html'],
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
                    if (id.includes('node_modules/react')) {
                        return 'vendor-react';
                    }
                },
            },
        }
    },
    // 预览服务器配置（与开发代理类似，但仅用于静态文件服务）
    preview: {
        port: 4173,
        open: true,
    },
});