import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'
import React, { useMemo } from 'react'

type PriceLabelProps = { price: number, currency?: string, color?: string, size?: number, style?: StyleProp<TextStyle> }

const PriceLabel = ({ price = 0, currency = '¥', color = '#8e33c8', size = 36, style }: PriceLabelProps) => {
    const value = useMemo(() => `${price / 100}`.split('.'), [price])
    return (
        <Text style={[styles.price, { color, fontSize: size / 1.6 }, style]}>
            <Text>{currency}</Text>
            <Text style={{ fontSize: size }}>{value[0]}</Text>
            {value?.[1] ? <Text>.{value[1]}</Text> : null}
        </Text>
    )
}

export default PriceLabel

const styles = StyleSheet.create({
    price: {
        fontWeight: 600,
    }
});