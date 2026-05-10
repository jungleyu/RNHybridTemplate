import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

const LoadingPanel = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator color={styles.loadingIndicator.color} />
            <Text style={styles.label}>加载中...</Text>
        </View>
    )
}

export default LoadingPanel

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
    },
    loadingIndicator: {
        color: '#6633c8',
    },
    label: {
        color: '#5E5E64',
    }
})