import React, { useCallback, useEffect, useRef } from 'react'
import { StyleSheet } from 'react-native'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { InjectionCode, PermissionPlugin, PluginManager, ToastPlugin } from '../native/webBridge'

const masonryHtml = require('../../assets/masonry.html')

const WebViewScreen = () => {

    const webViewRef = useRef<WebView>(null);
    const pmRef = useRef<PluginManager | null>(null)

    useEffect(() => {
        const pm = new PluginManager();
        pm.webViewRef = webViewRef;
        pm.register(ToastPlugin);
        pm.register(PermissionPlugin);
        pmRef.current = pm;

        return () => {
            pm.destroy();
        }
    }, []);

    const handleMessage = useCallback(async (event: WebViewMessageEvent) => {
        const pm = pmRef.current;
        if (!pm) {
            return;
        }
        let msg: any;
        try {
            msg = JSON.parse(event.nativeEvent.data);
        } catch {
            return;
        }
        if (msg?.type === 'call') {
            pm.handleCall(msg);
            return;
        }

    }, []);

    return (
        <WebView
            ref={webViewRef}
            injectedJavaScriptBeforeContentLoaded={InjectionCode}
            onMessage={handleMessage}
            source={masonryHtml}
            style={styles.page} />
    )
}

export default WebViewScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
    }
})