import { View, Text, Image, useWindowDimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC, isValidElement, useCallback, useMemo, useRef, useState } from 'react'
import { useProductDetail } from '../hooks/useProduct'
import { ScrollView } from 'react-native-gesture-handler';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { Button } from 'react-native-paper';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import CommentList from '../component/CommentList';
import Shopping from '../component/Shopping';
import DynamicHeightImage from '../component/DynamicHeightImage';
import PriceLabel from '../component/PriceLabel';
import ServiceGuarantees from '../component/ServiceGuarantees';
import Rank from '../component/Rank';
import useComments from '../hooks/useComment';
import useUserAddress from '../hooks/useUserAddress';
import { decrypt } from '../utils/crypto';

const TangibleDetail = () => {
    //@ts-ignore
    const { params: { mid, skuId } } = useRoute();
    const navigation = useNavigation();
    const { data }: any = useProductDetail(mid, skuId);
    const { width } = useWindowDimensions();
    const [webViewHeight, setWebViewHeight] = useState(1);
    const webViewHeightRef = useRef(webViewHeight);
    const sheetRef = useRef<TrueSheet>(null);
    const [SheetChild, setSheetChild] = useState<FC | null>(null);
    const { address } = useUserAddress();
    const activeAddress = useMemo(() => {
        return address?.find(add => add.defaulted === 1)
    }, [address]);

    const skuIds = useMemo(() => skuId ? [skuId] : [], [skuId])
    const { data: comments } = useComments({
        pageNum: 1,
        pageSize: 1,
        skuIds,
        sortType: 0,
    });

    const handleMessage = (event: WebViewMessageEvent) => {
        try {
            const eData = JSON.parse(event.nativeEvent.data);
            if (eData.height && webViewHeightRef.current < eData.height) {
                webViewHeightRef.current = eData.height;
                setWebViewHeight(eData.height);
            }
        } catch (error) {
            console.error("解析高度数据失败:", error);
        }
    };

    const toPage = useCallback(() => {
        navigation.dispatch(StackActions.push('Detail'))
    }, [navigation]);

    const openComments = useCallback(() => {
        setSheetChild(() => <CommentList skuId={skuId} />);
        sheetRef.current?.present();
    }, [skuId])

    const openShopping = useCallback((action: string = 'buy') => {
        setSheetChild(() => <Shopping mid={mid} spec={data.spec} action={action} />);
        sheetRef.current?.present();
    }, [mid, data.spec]);

    const openServiceGuarantees = useCallback(() => {
        setSheetChild(() => <ServiceGuarantees guarantees={data.serviceGuarantees} />);
        sheetRef.current?.present();
    }, [data.serviceGuarantees]);

    const toShoppingCart = useCallback(() => {
        navigation.dispatch(StackActions.push('ShoppingCart'))
    }, [navigation]);

    return (
        <View style={[styles.f1, { maxHeight: '100%' }]}>
            <ScrollView style={styles.f1}>
                <View style={styles.basicInfo}>
                    <Image style={{ width, height: width }} source={{ uri: data.headImage }} />
                    <View style={styles.sellInfo}>
                        <PriceLabel price={data.price} color='#fe642b' />
                        <Text style={styles.sellText}>{`已售${data.salesCount ?? 0}件`}</Text>
                    </View>
                    <Text style={styles.name} numberOfLines={2} ellipsizeMode='tail'>{data.name}</Text>
                    {
                        Array.isArray(data.featureTag) ? <View style={styles.tags}>
                            {
                                data.featureTag.map((tag: string) => {
                                    return <View key={tag} style={styles.tag}>
                                        <Text style={styles.tagLabel}>{tag}</Text>
                                    </View>
                                })
                            }
                        </View> : null
                    }
                    <Rank skuId={skuId} />
                </View>
                <View style={styles.section}>
                    {data.deliveryPeriod ? <View style={styles.row}>
                        <Image source={{
                            uri: 'https://res.coc.10086.cn/res/cdn/coc1/2025/09/03/1963135701245812736/1756882998239_433009.png.webp',
                            width: 24,
                            height: 24,
                        }} />
                        <View style={styles.transport}>
                            <Text style={styles.transportC}>{`承诺${data.deliveryPeriod}小时内发货`}</Text>
                            <Text style={styles.transportD}>快递: 免运费</Text>
                        </View>
                    </View> : null}
                    {
                        Array.isArray(data.serviceGuarantees) ? <TouchableOpacity onPress={openServiceGuarantees} style={styles.rowCenter}>
                            <Text><Text style={styles.bold}>服务保障</Text> | {data.serviceGuarantees.map((s: Record<string, string>) => s.serviceTitle).join(' ')}</Text>
                        </TouchableOpacity> : null
                    }
                </View>

                <TouchableOpacity style={[styles.section, styles.rowSpaceBetween]} onPress={() => openShopping('buy')}>
                    <>
                        <Text>
                            <Text style={styles.bold}>已选 </Text>
                            <Text>{Object.values(data?.spec ?? []).join(', ')}</Text>
                        </Text>
                        <Text>{'>'}</Text>
                    </>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.section, styles.rowSpaceBetween]} onPress={toPage}>
                    {activeAddress ? <>
                        <Text style={styles.bold}>送至</Text>
                        <Text style={styles.address}>{activeAddress.addressId ? `${activeAddress.province}${activeAddress.city}${activeAddress.district}${decrypt(activeAddress?.detailAddress ?? '')}` : ''}</Text>
                        <Text>{'>'}</Text></> : <>
                        <Text style={styles.bold}>暂无地址, 点击新增收货地址</Text>
                        <Text>{'>'}</Text>
                    </>
                    }
                </TouchableOpacity>

                {comments && comments.total > 0 ? <TouchableOpacity style={[styles.section, styles.rowSpaceBetween]} onPress={openComments}>
                    <>
                        <Text>评价 {`${comments.total}条`}</Text>
                        <Text>查看全部 {' >'}</Text>
                    </>
                </TouchableOpacity> : null}

                {
                    data.detailText ? <View style={styles.detailContainer}>
                        <Text style={[styles.bold, styles.detailTitle]}>
                            商品详情
                        </Text>
                        <Text>{data.detailText}</Text>
                    </View> : null
                }

                {data.richText ? <WebView
                    style={[styles.webview, { height: webViewHeight, }]}
                    originWhitelist={['*']}
                    source={{
                        html: `
                    <html>
                        <head>
                            <meta charset="utf-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <title></title>
                            <meta name="description" content="">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <style type="text/css">
                                * {
                                    margin: 0;
                                    padding: 0;
                                    box-sizing: border-box;
                                }
                                html, body {
                                    margin: 0;
                                    padding: 0;
                                    width: 100%;
                                    height: 100%;
                                }
                                .content img {
                                    max-width: 100%;
                                    width: 100%;
                                    height: auto;
                                    display: block;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="content">
                            ${data.richText}
                            </div>
                        </body>
                    </html>
                ` }}
                    javaScriptEnabled={true}
                    scrollEnabled={false}
                    injectedJavaScript={`
                    // 选择需要监听的最外层容器
                    // const targetElement = document.body || document.documentElement;
                    const targetElement = document.querySelector('.content')
                    
                    // 创建 ResizeObserver 实例
                    const resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        // 获取内容高度
                        let newHeight = entry.contentRect.height;
                        // 备选方案: 如果 contentRect 不准确，可使用 scrollHeight
                        // newHeight = Math.max(newHeight, targetElement.scrollHeight);
                        
                        // 去抖处理，避免频繁发送
                        if (window.pendingHeightUpdate) clearTimeout(window.pendingHeightUpdate);
                        window.pendingHeightUpdate = setTimeout(() => {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'height',
                            height: newHeight
                        }));
                        }, 100);
                    }
                    });

                    // 开始监听目标元素
                    resizeObserver.observe(targetElement);

                    // 监听窗口大小变化，确保在视口改变时重新计算
                    // window.addEventListener('resize', () => {
                    //     setTimeout(() => {
                    //         const newHeight = targetElement.scrollHeight;
                    //         window.ReactNativeWebView.postMessage(JSON.stringify({
                    //         type: 'height',
                    //         height: newHeight
                    //         }));
                    //     }, 100);
                    // });
                    true;
                    `}
                    onMessage={handleMessage}
                /> : Array.isArray(data.detailImages) ? (
                    data.detailImages.map((img: string) => (
                        <DynamicHeightImage key={img} imageUrl={img} />
                    ))
                ) : null
                }

                <TouchableOpacity style={[styles.section, styles.rowSpaceBetween]} onPress={toPage}>
                    <>
                        <Text>证件证明</Text>
                        <Text>{'>'}</Text>
                    </>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.bottomAction}>
                <TouchableOpacity onPress={() => openShopping('addCart')}>
                    <Image source={{
                        uri: 'https://res.coc.10086.cn/res/cdn/coc1/2025/09/03/1963078632668979200/1756869392638_724696.png.webp',
                        width: 90,
                        height: 48,
                    }} resizeMethod='resize' resizeMode='contain' />
                </TouchableOpacity>
                <Button style={styles.buyBtn} labelStyle={styles.buyBtnLabel} onPress={() => openShopping('buy')}>立即购买</Button>
                <TouchableOpacity style={styles.cart} onPress={toShoppingCart}>
                    <Image style={styles.cartImg} source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2025/09/17/1968210179566919680/56d90488aebe1630c623e324bf905a76.png' }} />
                </TouchableOpacity>
            </View>
            <TrueSheet
                scrollable
                ref={sheetRef}
                detents={[1]}
            >
                {isValidElement(SheetChild) && SheetChild}
            </TrueSheet>
        </View>
    )
}

export default TangibleDetail

const styles = StyleSheet.create({
    f1: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f4f5f6'
    },
    basicInfo: {
        backgroundColor: '#FFF',
        paddingHorizontal: 18,
        paddingBottom: 12,
    },
    row: {
        flexDirection: 'row'
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopColor: '#e8e8e8',
        borderTopWidth: .7,
    },
    sellInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
    },
    sellText: {
        color: '#fe642b',
        fontSize: 18,
        fontWeight: 600,
    },
    webview: {
        width: '100%',
        marginTop: 12
    },
    name: {
        color: '#333',
        fontSize: 22,
    },
    section: {
        paddingHorizontal: 18,
        paddingVertical: 13,
        marginVertical: 7,
        backgroundColor: '#FFF'
    },
    bold: {
        fontWeight: 'bold'
    },
    rowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    transport: {
        marginLeft: 8,
    },
    transportC: {
        fontSize: 16,
        color: 'rgb(0, 132, 60)',
        marginBottom: 5,
    },
    transportD: {
        fontSize: 16,
        color: '#333',
    },
    bottomAction: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFF',
    },
    buyBtn: {
        flex: 1,
        backgroundColor: '#8a6be9',
        borderRadius: 32,
        paddingVertical: 6,
    },
    buyBtnLabel: {
        color: '#FFF',
        fontSize: 20,
    },
    detailContainer: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        backgroundColor: "#FFF"
    },
    detailTitle: {
        fontSize: 20,
        marginBottom: 8,
    },
    tags: {
        flexDirection: 'row',
        gap: 6,
        paddingVertical: 8,
    },
    tag: {
        borderRadius: 6,
        borderColor: '#ffc4c4',
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 6,
        backgroundColor: '#fff0f0',
    },
    tagLabel: {
        fontSize: 12,
        color: '#fe642b',
        fontWeight: 'bold',
    },
    address: {
        color: '#5e5e5e',
        marginLeft: 8,
        flex: 1,
    },
    cart: {
        position: 'absolute',
        right: 20,
        top: '-260%',
        zIndex: 99,
    },
    cartImg: {
        width: 80,
        height: 80,
    },
})