import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { useAuth } from '../store/AuthContext'
import { TouchableRipple } from 'react-native-paper'
import { StackActions, useNavigation } from '@react-navigation/native'

const UserInfoCard = () => {
    const { user, } = useAuth();
    const navigation = useNavigation();

    const toLogin = useCallback(() => {
        navigation.dispatch(StackActions.replace('Login'));
    }, []);

    if (user) {
        return <View style={[styles.cardLeft, styles.info]}>
            <Text style={styles.infoText}>{`你好${user.name}, 我的资产`}</Text>
        </View>
    }

    return (
        <TouchableRipple style={styles.cardLeft} onPress={toLogin}>
            <Image style={{ flex: 1, }} resizeMode='cover' source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2025/09/24/1970760041638453248/c8bf2ff9a05a1f1702979beb0660f215_compressed.png' }} />
        </TouchableRipple>
    )
}

export default UserInfoCard

const styles = StyleSheet.create({
    cardLeft: {
        flex: 1,
        borderRadius: 12,
        height: 120,
        marginRight: 8,
        overflow: 'hidden'
    },
    info: {
        backgroundColor: '#eaf1ff',
        padding: 12,
    },
    infoText: {
        fontSize: 14,
        fontWeight: 'bold'
    }
})