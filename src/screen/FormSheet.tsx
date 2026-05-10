import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const FormSheet = () => {
    return (
        <View style={styles.page}>
            <Text>FormSheet</Text>
        </View>
    )
}

export default FormSheet

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})