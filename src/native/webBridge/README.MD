# BridgeSDK

BridgeSDK 是运行在 React Native WebView 容器中的原生能力调用入口。它通过 **Proxy 动态代理** 将所有模块访问转换为异步桥接请求，让 H5 开发者像调用普通 JavaScript 函数一样使用原生相机、定位、存储等能力，同时提供 **TypeScript 类型提示**、**参数校验** 和 **安全权限控制**。

---

## 工作流程（模拟执行）

```mermaid
sequenceDiagram
    participant Dev as 开发者
    participant HV as HybridWebView
    participant PM as PluginManager
    participant WV as WebView
    participant SDK as BridgeSDK (H5)
    participant H5 as 业务代码

    Note over Dev,PM: 1. 定义与注册插件
    Dev->>HV: 创建插件 (如 CameraPlugin)
    HV->>PM: 创建 PluginManager
    HV->>PM: pm.register(CameraPlugin)
    PM->>PM: 存入插件表
    HV->>WV: 挂载 WebView 并注入 BridgeSDK 脚本

    Note over H5,PM: 2. 运行时调用
    H5->>SDK: BridgeSDK.camera.takePhoto({ quality: 0.8 })
    SDK->>SDK: 生成 callbackId，存储 Promise，发送消息
    SDK->>WV: postMessage(调用信息)
    WV->>PM: onMessage → handleCall
    PM->>PM: 查找插件，权限校验
    PM->>PM: 调用 camera.takePhoto(params)
    PM-->>WV: injectJavaScript 返回结果
    WV->>SDK: 执行回调，resolve Promise
    SDK-->>H5: 返回照片 URI