import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    type ReactEventHandler,
} from "react";
import { StyleSheet, } from "react-native";
import { WebView as RNWebView, type WebViewProps as RNWebViewProps } from "react-native-webview";
import type { WebViewSourceHtml } from "react-native-webview/lib/WebViewTypes";

const replaceLast = (
    str: string,
    pattern: string | RegExp,
    replacement: string
) => {
    const match =
        typeof pattern === "string"
            ? pattern
            : (str.match(new RegExp(pattern.source, "g")) || []).slice(-1)[0];
    if (!match) return str;
    const last = str.lastIndexOf(match);
    return last !== -1
        ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}`
        : str;
};

interface WebviewProps extends RNWebViewProps {
    title?: string;
}

// This js adds a postMessage function to the webview
const DEFAULT_INJECT_JS = `window.ReactNativeWebView = { postMessage: (...args) => window.parent.postMessage(args[0])}`;

const WebView = forwardRef<RNWebView, WebviewProps>((props, ref) => {
    const {
        title,
        source,
        onLoad,
        scrollEnabled,
        style,
        injectedJavaScript,
        injectedJavaScriptBeforeContentLoaded,
        onMessage
    } = props;
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const styleObj = StyleSheet.flatten(style);

    // Get iframe source
    const _source = useMemo(() => {
        // TODO: support other source types
        if (!source) return undefined;
        // TODO: support base url
        if ((source as WebViewSourceHtml).html) {
            const pageHtml = (source as WebViewSourceHtml).html;
            // Inject javascript
            const jsToInject = `${DEFAULT_INJECT_JS} ${injectedJavaScript ?? ""
                } ${injectedJavaScriptBeforeContentLoaded ?? ""}`;
            return replaceLast(
                pageHtml,
                "</body>",
                `<script>${jsToInject}</script></body>`
            );
        }
        return undefined;
    }, [injectedJavaScript, injectedJavaScriptBeforeContentLoaded, source]);

    // Initialize ref - most functions here are mocked - we should implement them
    useImperativeHandle(
        ref,
        () =>
        ({
            goBack: () => {
                iframeRef.current?.contentWindow?.history.back();
            },
            goForward: () => {
                iframeRef.current?.contentWindow?.history.forward();
            },
            reload: () => {
                iframeRef.current?.contentWindow?.location.reload();
            },
            stopLoading: () => {
                iframeRef.current?.contentWindow?.stop();
            },
            injectJavaScript: (js: string) => {
                // @ts-ignore
                iframeRef.current?.contentWindow?.Function(js)();
            },
            forceUpdate: () => { },
            postMessage: (message: string, origin: string) => {
                iframeRef.current?.contentWindow?.postMessage(message, origin);
            },
            clearCache: () => { },
            requestFocus: () => {
                iframeRef.current?.contentWindow?.focus();
            },
            clearHistory: () => { },
            clearFormData: () => { },
        } as unknown as RNWebView)
    );

    useEffect(() => {
        // Listen for messages
        if (!onMessage) return;
        const onMsg = (nativeEvent: MessageEvent) => {
            if (typeof nativeEvent.data !== 'string') {
                return;
            };
            // @ts-ignore
            return onMessage({ nativeEvent });
        };
        window.addEventListener("message", onMsg, true);
        return () => {
            window.removeEventListener("message", onMsg, true);
        };
    }, [onMessage]);

    return (
        <iframe
            title={title}
            ref={iframeRef}
            src={typeof source === 'string' ? source : undefined}
            srcDoc={_source}
            width={styleObj.width?.toString()}
            height={styleObj.height?.toString()}
            style={
                StyleSheet.flatten([
                    styles.iframe,
                    !scrollEnabled && styles.noScroll,
                    style,
                ]) as React.CSSProperties
            }
            allowFullScreen
            seamless
            onLoad={onLoad as unknown as ReactEventHandler<HTMLIFrameElement>}
        />
    );
});

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    iframe: {
        width: "100%",
        height: "100%",
        borderWidth: 0,
    },
    noScroll: {
        overflow: "hidden",
    },
});

export { WebView };
export default WebView;