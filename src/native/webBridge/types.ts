
import { RefObject } from "react";

// H5 发起的调用消息
export interface CallMessage {
    type: 'call';
    callbackId: string;
    module: string;
    method: string;
    params?: any;
    meta?: { url?: string };
}

// Native 回传的结果消息
export interface CallbackMessage {
    type: 'callback';
    callbackId: string;
    result?: any;
    error?: string | null;
}

// Native 主动推送的事件消息
export interface EventMessage {
    type: 'event';
    eventName: string;
    eventData?: any;
}

export type PluginMessage = CallMessage | CallbackMessage | EventMessage;

export type PluginManager = {
    plugins: Record<string, Plugin>,
    webViewRef: RefObject<any> | null,
}

// 插件方法上下文
export interface PluginContext {
    context: React.RefObject<any> | null; // WebView 引用
    emit: (eventName: string, data?: any) => void;
    pluginManager?: PluginManager;
}

// 插件方法签名
export type PluginMethod = (params?: any, ctx?: PluginContext) => Promise<any>;

// 插件权限配置
// export interface PluginPermissions {
//     domains?: string[];                     // 允许调用的域名
//     methods?: {
//         [methodName: string]: {
//             domains?: string[];
//             authRequired?: boolean;
//         };
//     };
// }

// 插件接口
export interface Plugin {
    name: string;
    methods: {
        [methodName: string]: PluginMethod;
    };
    events?: string[];
    version?: string;
    // permissions?: PluginPermissions;
    destroy?: () => void;
}