import React from 'react'
import { StyleSheet } from 'react-native'
import WebView from 'react-native-webview'
const masonryHtml = require('../../assets/masonry.html?raw')

const WebViewScreen = () => {
    return (
        <WebView
            source={{ html: masonryHtml }}
            style={styles.page} />
    )
}

export default WebViewScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
    }
})