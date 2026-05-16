// 通过webview的 injectedJavaScriptBeforeContentLoaded 属性注入

const injectionCode = `
(function () {
    if (window.BridgeSDK) return;

    const pendingCallbacks = new Map();
    const eventListeners = new Map();
    let callbackIdCounter = 0;

    function generateCallbackId() {
        return 'cb_' + Date.now() + (++callbackIdCounter)
    }

    function postMessage(msg) {
        window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    }

    // 通用的 call 调用（不对外暴露）
    function _call(module, method, params, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const callbackId = generateCallbackId();
            const timer = setTimeout(() => {
                pendingCallbacks.delete(callbackId);
                reject(new Error('NativeModules call timed out: ' + module + '.' + method));
            }, timeout);
            pendingCallbacks.set(callbackId, { resolve, reject, timer });
            postMessage({
                type: 'call',
                module,
                method,
                params,
                callbackId,
                meta: {
                    url: window.location.href,
                }
            })
        });
    }

    // 内部事件监听
    function _on(eventName, callback) {
        if (!eventListeners.has(eventName)) {
            eventListeners.set(eventName, new Set());
        }
        eventListeners.get(eventName).add(callback);
    }
    // 内部事件移除
    function _off(eventName, callback) {
        if (eventListeners.has(eventName)) {
            eventListeners.get(eventName).delete(callback);
        }
    }

    /* ========== 统一接收 React Native 回传 ========== */
    window.addEventListener('message', (event) => {
        let msg;
        try {
            msg = JSON.parse(event.data);
        } catch (e) {
            console.warn('Invalid message from React Native:', event.data);
            return;
        }
        if (msg.type === 'callback') {
            const { callbackId } = msg;
            const callback = pendingCallbacks.get(callbackId);
            if (callback) {
                clearTimeout(callback.timer);
                pendingCallbacks.delete(callbackId);
                if (msg.error) {
                    callback.reject(new Error(msg.error));
                } else {
                    callback.resolve(msg.result);
                }
            }
        } else if (msg.type === 'event') {
            const { eventName, eventData } = msg;
            const listeners = eventListeners.get(eventName);
            if (listeners) {
                listeners.forEach(listener => {
                    try {
                        listener(eventData);
                    } catch (e) {
                        console.error('Error in event listener:', e);
                    }
                })
            }
        }
    });

    /* ========== 对外暴露的唯一入口 ========== */
    window.BridgeSDK = new Proxy({
        on: _on,
        off: _off,
    }, {
        get(target, prop, receiver) {
            // 优先返回直接挂载的方法
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }
            // --- 模块名代理 ---
            const moduleName = prop;
            // 给模块目标对象附加调试属性
            const moduleTarget = {
                _moduleName: moduleName,
                _description: "Native module " + moduleName
            };
            // 定义友好的 toString 标签
            Object.defineProperty(moduleTarget, Symbol.toStringTag, {
                value: "BridgeSDK." + moduleName
            });
            // 其他属性则当作模块调用，返回一个函数
            return new Proxy(moduleTarget, {
                get(_, method) {
                    if (typeof method !== 'string') return;
                    if (method === Symbol.toStringTag) {
                        return "BridgeSDK." + moduleName;
                    }

                    // --- 方法名处理 ---
                    const fn = (params, timeout) => _call(moduleName, method, params, timeout);

                    // 标记方法来源
                    fn._module = moduleName;
                    fn._method = method;
                    Object.defineProperty(fn, Symbol.toStringTag, {
                        value: "BridgeSDK." + moduleName + "." + method
                    });
                    // 让函数 toString() 时返回友好描述
                    fn.toString = () => "[BridgeSDK." + moduleName + "." + method + "]";

                    return fn;
                }
            });
        }
    });

})();
`;

export default injectionCode;