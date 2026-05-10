import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import useComments from "../hooks/useComment";
import LoadingPanel from "./LoadingPanel";

export default function CommentList({ skuId }: { skuId: string }) {
    const skuIds = useMemo(() => skuId ? [skuId] : [], [skuId]);
    const [sortType, setSortType] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const { data, loading, resetData } = useComments({
        skuIds,
        pageNum,
        pageSize: 10,
        sortType,
    }, pageNum > 1);

    const loadMore = useCallback(() => {
        if (loading) {
            return;
        }
        if (data?.pages && pageNum >= data?.pages) {
            return;
        }
        setPageNum(prev => prev + 1);
    }, [loading, pageNum, data?.pages]);

    const renderItem = useCallback(({ item }: any) => {
        return <View style={styles.item}>
            <View style={[styles.row, styles.rowVerticalCenter, styles.line]}>
                <Image style={styles.avatar} source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2025/12/02/1995681745615065088/1764642580515_402176.png.webp' }} />
                <Text>{item.userMobile}</Text>
            </View>
            <View style={[styles.row, styles.rowVerticalCenter, styles.line, styles.space]}>
                <Text style={styles.gradeText}>{item.evaluationLevelDesc}</Text>
                <Text style={styles.info}>{' 已购 '}{item.productSpec}</Text>
                <Text style={styles.info}>{item.showTime}</Text>
            </View>
            {item.tagName ? <Text style={styles.tagName}>{item.tagName.split(',').join('  ')}</Text> : <Text style={styles.comment}>{'该用户觉得商品非常好,给出好评'}</Text>}
        </View>
    }, [])

    return <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>评价</Text>
        <View style={styles.rowCenter}>
            <Button mode={sortType === 0 ? 'contained' : 'text'} onPress={() => {
                resetData();
                setPageNum(1);
                setSortType(0);
            }}>默认排序</Button>
            <Button mode={sortType === 1 ? 'contained' : 'text'} onPress={() => {
                resetData();
                setPageNum(1);
                setSortType(1);
            }}>最新</Button>
        </View>
        {
            (!data?.records && loading) ? <View style={styles.rowCenter}>
                <ActivityIndicator color={styles.gradeText.color} />
                <Text style={styles.info}>加载中...</Text>
            </View> : <FlatList
                style={styles.f1}
                data={data?.records ?? []}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={loading ? <LoadingPanel /> : null}
            />
        }
    </View>
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    f1: {
        flex: 1,
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowVerticalCenter: {
        alignItems: 'center'
    },
    commentsContainer: {
        paddingHorizontal: 12,
        flex: 1,
    },
    commentsTitle: {
        width: '100%',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12,
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
        paddingVertical: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#ddd',
        marginRight: 6,
    },
    line: {
        paddingVertical: 4,
    },
    space: {
        justifyContent: 'space-between'
    },
    gradeText: {
        color: '#6633c8',
    },
    comment: {
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 4,
    },
    tagName: {
        fontSize: 14,
        color: '#666',
    },
    info: {
        color: '#5E5E64',
    }
})