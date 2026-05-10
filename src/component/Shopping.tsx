import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSpecInfo } from '../hooks/useSpecInfo'
import { Button, } from 'react-native-paper'
import PriceLabel from './PriceLabel'
import { getAvailableSpecMap, getCurrentFullSku, isSpecItemDisabled } from '../utils/skuUtils'
import { useAddToShoppingCart } from '../hooks/useAddToShoppingCart'
import { TrueSheet } from '@lodev09/react-native-true-sheet'

const Shopping = ({ mid, spec, action }: { mid: string, spec: { [key: string]: string }, action: string }) => {
    const { data: { skuList, specList, spuInfo } } = useSpecInfo(mid);
    const [currentSpec, setCurrentSpec] = useState(spec);
    // 计算可点击规格
    const availableMap = useMemo(() => {
        return getAvailableSpecMap(currentSpec, skuList);
    }, [currentSpec, skuList]);

    // 当前完整SKU
    const currentSku = useMemo(() => {
        return getCurrentFullSku(currentSpec, specList, skuList);
    }, [currentSpec, specList, skuList]);

    // 选择规格
    const handleSelect = (specCode: string, val: string) => {
        setCurrentSpec(prev => {
            // // 同规格互斥，重复点击取消
            // if (prev[specCode] === val) {
            //     const next = { ...prev };
            //     delete next[specCode];
            //     return next;
            // }
            return { ...prev, [specCode]: val };
        });
    };

    const { setCart, succeed } = useAddToShoppingCart();

    const { mcdsId, name } = currentSku ?? {}
    const addToCart = useCallback(() => {
        // console.log('Add product to cart: ', currentSku);
        setCart(mcdsId ?? '', name ?? '', 1)
    }, [mcdsId, name, setCart]);

    useEffect(() => {
        if (succeed) {
            ToastAndroid.showWithGravity("加入购物车成功", ToastAndroid.LONG, ToastAndroid.BOTTOM);
            let timerId = setTimeout(() => {
                TrueSheet.dismissAll();
            }, ToastAndroid.LONG);
            return () => clearTimeout(timerId);
        }
    }, [succeed]);

    if (!skuList.length) {
        return null;
    }

    return (
        <>
            <ScrollView style={styles.list} contentContainerStyle={styles.content}>
                <View style={[styles.row, styles.goodsInfo]}>
                    <Image style={styles.skuPic} source={{ uri: currentSku?.skuPic ?? spuInfo?.feedsPic ?? '' }} />
                    <View style={{ justifyContent: 'space-between' }}>
                        <PriceLabel price={currentSku?.price ?? 0} />
                        {
                            Array.isArray(spuInfo?.featureTag) ? <View style={[styles.row, styles.tagContainer]}>
                                {
                                    spuInfo.featureTag.map((tag: string) => {
                                        return <View key={tag} style={styles.tag}><Text style={styles.tagLabel}>{tag}</Text></View>
                                    })
                                }
                            </View> : null
                        }
                        <View style={[styles.row, { alignItems: 'center' }]}>
                            <Text style={{ fontSize: 16 }}>数量</Text>
                            <View style={[styles.row, { width: 100, height: 36, borderWidth: 1, borderColor: '#EEE', alignItems: 'center', marginLeft: 16, borderRadius: 8 }]}>
                                <Text style={{ fontSize: 16, width: 36, textAlign: 'center', borderRightWidth: .5, borderRightColor: '#EEE' }}>-</Text>
                                <Text style={{ fontSize: 16, flex: 1, textAlign: 'center' }}>1</Text>
                                <Text style={{ fontSize: 16, width: 36, textAlign: 'center' }}>+</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {
                    Array.isArray(specList) ? specList.map(specItem => {
                        if (!Array.isArray(specItem.items) || specItem.items.length <= 0) {
                            return null;
                        }
                        return <Fragment key={specItem.code}>
                            <Text style={styles.specTitle}>{specItem.name}</Text>
                            <View style={[styles.row, { flexWrap: 'wrap', gap: 16 }]}>
                                {
                                    specItem.items.map(item => {
                                        const active = item.value === currentSpec[specItem.code]
                                        const disabled = isSpecItemDisabled(specItem.code, item.value, availableMap)
                                        return <TouchableOpacity
                                            key={item.value}
                                            // disabled={disabled}
                                            onPress={() => {
                                                handleSelect(specItem.code, item.value)
                                            }}
                                            style={[styles.specItem, disabled && styles.disabled, active && styles.active]}>
                                            <Text style={[styles.specItemLabel, active ? styles.activeLabel : null]}>{item.value}</Text>
                                            {
                                                disabled ? <View style={styles.noStock}>
                                                    <Text>缺货</Text>
                                                </View> : null
                                            }
                                        </TouchableOpacity>
                                    })
                                }
                            </View >
                        </Fragment>
                    }) : null
                }
            </ScrollView >
            <View style={styles.bottomAction}>
                {action === 'buy' ? <Button style={styles.buyBtn} labelStyle={styles.buyBtnLabel} >
                    {'立即支付  '}
                    <PriceLabel price={currentSku?.price ?? 0} size={20} color='#FFF' />
                </Button> : <Button style={styles.buyBtn} labelStyle={styles.buyBtnLabel} onPress={addToCart} >加入购物车</Button>}
            </View>
        </>
    )
}

export default Shopping

const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 44
    },
    row: {
        flexDirection: 'row'
    },
    goodsInfo: {
        borderTopColor: '#EEE',
        borderTopWidth: .3,
        paddingVertical: 16,
    },
    skuPic: {
        width: 120,
        height: 120,
    },
    active: {
        borderWidth: 1,
        borderColor: '#8e33c8',
        backgroundColor: '#f1e9ff'
    },
    activeLabel: {
        color: '#8e33c8'
    },
    disabled: {
        opacity: .5,
        backgroundColor: '#f2f2f2'
    },
    specTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#333',
        marginBottom: 6,
        marginTop: 12,
    },
    specItem: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 4,
    },
    specItemLabel: {
        color: '#5e5e5e',
        fontSize: 16,
    },
    bottomAction: {
        padding: 12,
        backgroundColor: '#FFF',
    },
    buyBtn: {
        backgroundColor: '#8a6be9',
        borderRadius: 32,
        paddingVertical: 6,
    },
    buyBtnLabel: {
        color: '#FFF',
        fontSize: 20,
    },
    noStock: {
        backgroundColor: '#f7f7f7',
        opacity: 1,
        position: 'absolute',
        borderRadius: 4,
        padding: 4,
        right: 0,
        top: 0,
        zIndex: 1,
        transform: [
            { translateX: '50%' },
            { translateY: '-50%' }
        ]
    },
    tagContainer: {
        gap: 4,
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    tag: {
        backgroundColor: '#f1e9ff',
        borderWidth: 1,
        borderColor: '#8e33c8',
        borderRadius: 4,
        padding: 4,
    },
    tagLabel: {
        color: '#8e33c8',
        fontSize: 12,
    },
})