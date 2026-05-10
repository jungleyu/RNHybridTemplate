import React from 'react'
import { StyleSheet } from 'react-native'
import WebView from 'react-native-webview'
const masonryHtml = require('../../assets/masonry.html')

const WebViewScreen = () => {
    return (
        <WebView source={masonryHtml} style={styles.page} />
    )
}

export default WebViewScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
    }
})