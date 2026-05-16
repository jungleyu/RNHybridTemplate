import { RefObject } from "react";
import { CallbackMessage, CallMessage, EventMessage, type Plugin } from "./types";

export default class PluginManager {
    private plugins = new Map<string, Plugin>();
    private _webViewRef: RefObject<any> | null = null

    set webViewRef(ctx: RefObject<any> | null) {
        this._webViewRef = ctx
    }

    get webViewRef(): RefObject<any> | null {
        return this._webViewRef
    }

    register(plugin: Plugin): void {
        if (!plugin.name || !plugin.methods) {
            throw new Error('Registered module must have a name and at least one method. Invalid module: ' + JSON.stringify(module));
        }
        this.plugins.set(plugin.name, plugin);
    }

    unregister(moduleName: string): void {
        const plugin = this.plugins.get(moduleName);
        if (plugin && typeof plugin.destroy === 'function') {
            try {
                plugin.destroy()
            } catch (e) {
                console.warn('Error while destroying plugin ' + moduleName, e);
            }
            this.plugins.delete(moduleName);
        }
    }

    // 供容器 onMessage 调用
    async invoke(moduleName: string, methodName: string, params?: any) {
        const plugin = this.plugins.get(moduleName);
        if (!plugin) {
            throw new Error(`Plugin "${moduleName}" not registered`);
        }

        const method = plugin.methods[methodName];
        if (!method) {
            throw new Error(`Method "${methodName}" not found in plugin "${moduleName}"`);
        }

        const context = {
            context: this._webViewRef,
            emit: (eventName: string, data?: any) => this.emit(moduleName, eventName, data)
        }
        return method(params, context);
    }

    private _sendCallback(callbackId: string, result?: any, error?: string | null) {
        const callbackMsg: CallbackMessage = {
            type: 'callback',
            callbackId,
            result,
            error,
        }
        const jsStr = `window.postMessage(${JSON.stringify(JSON.stringify(callbackMsg))})`;
        this._webViewRef?.current?.injectJavaScript(jsStr)
    }

    async handleCall(message: CallMessage) {
        if (!this._webViewRef?.current) {
            return;
        }
        const { callbackId, module, method, params, } = message;

        try {
            const result = await this.invoke(module, method, params);
            this._sendCallback(callbackId, result);
        } catch (error: any) {
            this._sendCallback(callbackId, null, error.message);
        }
    }

    emit(moduleName: string, eventName: string, eventData?: any) {
        if (!this._webViewRef?.current) {
            return;
        }
        const message: EventMessage = {
            type: 'event',
            eventName: `${moduleName}:${eventName}`,
            eventData,
        }
        const jsStr = `window.postMessage(${JSON.stringify(JSON.stringify(message))})`;
        this._webViewRef.current.injectJavascript(jsStr);
    }

    destroy() {
        for (const [name] of this.plugins) {
            this.unregister(name);
        }
        this.plugins.clear();
        this._webViewRef = null;
    }
}