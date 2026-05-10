import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { memo, useCallback } from 'react'
import { StackActions, useNavigation } from '@react-navigation/native';

const EmptyCart = () => {
    const navigation = useNavigation();
    const toSurf = useCallback(() => {
        navigation.dispatch(StackActions.push('Home'));
    }, [navigation]);
    return (
        <View style={styles.container}>
            <Image style={styles.img} source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2024/09/10/1833395809329156096/1725950597142_656938.png' }} />
            <Text style={styles.desc}>您的购物车空空如也快去选购吧～</Text>
            <TouchableOpacity style={styles.surf} onPress={toSurf}>
                <Text style={styles.surfLabel}> 去逛逛 </Text>
            </TouchableOpacity>
        </View>
    )
}

export default memo(EmptyCart)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '33%'
    },
    img: {
        width: 120,
        height: 120,
    },
    desc: {
        color: '#666',
        fontSize: 18,
        marginTop: 18,
        maxWidth: 200,
        textAlign: 'center',
    },
    surf: {
        backgroundColor: '#87a1ff',
        paddingHorizontal: 64,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 12,
    },
    surfLabel: {
        color: '#FFF',
        fontSize: 18,

    }
})