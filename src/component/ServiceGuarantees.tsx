import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

type GuaranteeType = { serviceTitle: string, serviceContent: string, serviceLogoUrl?: string }

const ServiceGuarantees = ({ guarantees }: { guarantees: GuaranteeType[] }) => {
    return (
        <>
            <View style={styles.titleContainer}><Text style={styles.title}>服务保障中</Text></View>
            {
                guarantees.map(guarantee => {
                    return <View key={guarantee.serviceTitle} style={styles.item}>
                        <Text style={styles.title}>{guarantee.serviceTitle}</Text>
                        <Text style={styles.content}>{guarantee.serviceContent}</Text>
                    </View>
                })
            }
        </>
    )
}

export default ServiceGuarantees

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: 20,
        paddingVertical: 8,
        alignItems: 'center',
    },
    item: {
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 20,
        lineHeight: 32,
        fontWeight: 'bold'
    },
    content: {
        fontSize: 16,
        color: '#999',
    }
})