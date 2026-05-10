import { View, StyleSheet, TouchableOpacity, Image, Text, TextInput } from 'react-native'
import React, { useCallback } from 'react'
import { RadioButton } from 'react-native-paper'
import { StackActions, useNavigation } from '@react-navigation/native'

const CartItem = ({ item }: { item: Record<string, any> }) => {
    const navigation = useNavigation();
    const onItemPress = useCallback(() => {
        navigation.dispatch(StackActions.push('TangibleDetail', {
            mid: item.mid,
            skuId: item.skuId
        }));
    }, [navigation, item.mid, item.skuId]);
    return (
        <View style={styles.container}>
            {item.shopName ?
                <TouchableOpacity style={styles.shopBox}>
                    <Image style={styles.shopLogo} source={{ uri: item.shopLogoUrl }} />
                    <Text style={styles.shopName}>
                        {item.shopName}
                    </Text>
                    <Image style={styles.moreImg} resizeMode='contain' source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2025/09/17/1968131046412505088/50d48934e5366736dc05c2e2f96bb13c.png', }} />
                </TouchableOpacity> : null
            }
            <TouchableOpacity style={styles.card} onPress={onItemPress}>
                <TouchableOpacity style={styles.select}>
                    <RadioButton value='' status='checked' />
                </TouchableOpacity>
                <View style={styles.logoBox}>
                    <Image
                        resizeMode='cover'
                        style={styles.logo}
                        source={{ uri: item.thumbnail }} />
                </View>
                <View style={styles.infoBox}>
                    <View style={styles.titleWrap}>
                        <Text style={styles.title} numberOfLines={2} ellipsizeMode='tail'>
                            {item.isUseBean ? <Image style={styles.beanImg} resizeMode='contain' source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2026/01/15/2011730940494467072/dou.png.webp', }} /> : null}
                            {item.offerName}
                        </Text>
                    </View>
                    <Text style={styles.desc}>{item.mcdsDesc}</Text>
                    <Text style={styles.vipPrice}>¥<Text>{item.vipPrice}</Text></Text>
                    <Text style={styles.originPrice}>标准价¥<Text>{item.discountPrice}</Text></Text>
                </View>
                <View style={styles.countAction}>
                    <View style={styles.countGroup}>
                        <View style={[styles.countBtn, styles.borderRight]}>
                            <Text>-</Text>
                        </View>
                        <TextInput style={styles.input} value='1' />
                        <View style={[styles.countBtn, styles.borderLeft]}>
                            <Text>+</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default CartItem

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingVertical: 8,
    },
    shopBox: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 8,
        alignItems: 'center'
    },
    shopLogo: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    shopName: {
        fontSize: 16,
        color: '#333',
        fontWeight: 700,
        marginRight: 6,
    },
    moreImg: {
        width: 10,
        height: 14,
    },
    card: {
        flexDirection: 'row',
    },
    row: {
        flexDirection: 'row',
    },
    select: {
        width: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 64,
        height: 64,
        marginRight: 4,
    },
    infoBox: {
        flex: 1,
    },
    titleWrap: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        color: '#333',
        fontWeight: '700',
        textAlignVertical: 'center',
    },
    beanImg: {
        width: 20,
        height: 20,
        transform: [
            {
                translateY: 5,
            }
        ]
    },
    desc: {
        color: '#999',
        fontSize: 14,
    },
    vipPrice: {
        color: '#fe642b',
        fontSize: 16,
        fontWeight: '500'
    },
    originPrice: {
        color: '#999',
        fontSize: 12,
        fontWeight: '400'
    },
    countAction: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    countGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e1e1e1'
    },
    countBtn: {
        width: 28,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: '#e1e1e1'
    },
    borderLeft: {
        borderLeftWidth: 1,
        borderLeftColor: '#e1e1e1'
    },
    input: {
        width: 28,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingVertical: 0,
        includeFontPadding: false,
    }
})