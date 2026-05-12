import { useCallback, useEffect, useState, } from "react";
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

import { Button, } from "react-native-paper";
import UserInfoCard from "../component/UserInfoCard";
import { getProductByGroupId } from "../service/iGoService";
import DailyLifeList from "../component/DailyLifeList";
import PriceLabel from "../component/PriceLabel";

import Navigation from '../../specs/NativeNavigation';

function HomeHeader() {
    return <>
        <View style={styles.card}>
            <UserInfoCard />
            <View style={styles.cardRight}>
                <Image style={styles.cardRight} resizeMode='cover' source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2025/09/26/1971432107962327040/3816ecba0c7921261fcc41755cde5212.png' }} />
                <Text style={styles.cardRightText}>开通智臻会员</Text>
            </View>
        </View>

        <TouchableOpacity style={styles.searchBar}>
            <Image style={styles.search} resizeMode='cover' source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2026/03/09/2030913467512057856/1773042478988_629559.png.webp' }} />
        </TouchableOpacity>

        <DailyLifeList />
    </>
}

const tabs = ['精选', '通信', '权益', '百货', '数码']
export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProductByGroupId({
            groupId: '11560',
            strategyCode: 'C00020260114001',
            componentType: '5',
        }).then(list => {
            setProducts(list);
        })
    }, []);

    const toProductDetail = useCallback((mid: string, skuId: string) => {
        Navigation.navigate('TangibleDetail', {
            mid, skuId
        });
    }, []);

    const toPage = useCallback((pageId: string) => {
        Navigation.navigate(pageId, undefined)
    }, []);


    const renderSectionHeader = useCallback(() => {
        return <View style={styles.sectionHeader}>
            {
                tabs.map((tab => (
                    <View key={tab} style={styles.tab}>
                        <Text style={styles.tabLabel}>{tab}</Text>
                    </View>
                )))
            }
        </View>
    }, []);

    const renderItem = useCallback(({ item }: { item: Record<string, any> }) => {
        return <TouchableOpacity style={styles.goodItem} onPress={() => toProductDetail(`${item.mid}`, `${item.id}`)}>
            <>
                <Image style={styles.goodImg} resizeMode='contain' source={{ uri: item.cdnUrl }} />
                <View style={styles.goodInfo}>
                    <Text style={styles.goodName} numberOfLines={1}>{item.name}</Text>
                    <ImageBackground resizeMode="cover" style={styles.goodBuyBtn} source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2025/09/12/1966439897223192576/buyBtn.png' }}>
                        <Button labelStyle={styles.buyBtnLabel} style={styles.buyBtn}>
                            <PriceLabel price={item.price} size={16} />
                        </Button>
                        <Button labelStyle={styles.buyBtnLabel} style={styles.buyBtn} textColor="#FFF">立即购买</Button>
                    </ImageBackground>
                </View>
            </>
        </TouchableOpacity>
    }, [toProductDetail])

    const renderListFooter = useCallback(() => {
        return <>
            <Button mode="outlined" style={styles.btn} onPress={() => toPage('Detail')}>
                点击跳转详情页
            </Button>
            <Button mode="outlined" style={styles.btn} onPress={() => toPage('WebView')}>
                点击跳转WebView页
            </Button>
            <Button mode="outlined" style={styles.btn} onPress={() => toPage('ShoppingCart')}>
                点击跳转购物车
            </Button>
            <Button mode="outlined" style={styles.btn} onPress={() => toPage('Chat')}>
                点击跳转Chat
            </Button>
        </>
    }, [toPage]);

    if (!products.length) {
        return <>
            <HomeHeader />
            {renderListFooter()}
        </>
    }

    return <FlatList
        style={styles.list}
        contentContainerStyle={styles.page}
        data={products}
        ListHeaderComponent={HomeHeader}
        renderItem={({ item, index }) => {
            if (index === 0 || index === 1) {
                return renderSectionHeader()
            }
            return renderItem({ item });
        }}
        stickyHeaderIndices={[1]}
        numColumns={2}
        ListFooterComponent={renderListFooter()}
    />
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    page: {
        padding: 12,
    },
    bold: {
        fontWeight: '700',
    },
    btn: {
        padding: 8,
        backgroundColor: '#eee'
    },
    card: {
        flexDirection: 'row',
    },
    cardRight: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 12,
    },
    cardRightText: {
        fontSize: 14,
        height: 36,
        paddingLeft: '10%',
        paddingTop: '6%',
        position: 'absolute',
        fontWeight: 'bold',
    },
    searchBar: {
        marginTop: 12,
        width: '100%',
        aspectRatio: 125 / 9
    },
    search: {
        flex: 1,
    },
    pagerContainer: {
        height: 'auto'
    },
    sectionHeader: {
        height: 68,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#efefef'
    },
    tab: {
        flex: 1,
        paddingHorizontal: 16,
    },
    tabLabel: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    goodItem: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        margin: 6,
        backgroundColor: '#FFF'
    },
    goodImg: {
        width: '100%',
        aspectRatio: 5 / 6
    },
    goodInfo: {
        padding: 12,
        backgroundColor: '#FFF'
    },
    goodName: {
        marginBottom: 6,
    },
    goodBuyBtn: {
        flex: 1,
        flexDirection: 'row',
        height: 42,
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyBtn: {
        flex: 1,
    },
    buyBtnLabel: {
        fontSize: 12,
    },
})