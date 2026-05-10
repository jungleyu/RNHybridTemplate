import { View, Text, StyleSheet, Image } from 'react-native'
import React, { memo } from 'react'
import { useRankBySku } from '../hooks/useRankBySku'

const Rank = ({ skuId }: { skuId: string }) => {
    const { rank } = useRankBySku(skuId);
    if (!Array.isArray(rank) || rank.length <= 0) {
        return null;
    }
    const { rankCname, rankName, sortNum } = rank[0] ?? {}
    if (!rankCname || !rankName) {
        return null
    }
    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2026/01/26/2015620182182318080/1769396273859_757301.png' }} style={styles.rankIcon} />
            <Text style={styles.rankName}>{rankName}</Text>
            <Image source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2026/01/26/2015620182085849088/1769396273858_298350.png' }} style={styles.rankIcon} />
            <Text style={styles.rankDesc}>入选移动爱购商城{rankCname}{rankName}·第{sortNum}名</Text>
            <Image
                resizeMode='contain'
                style={styles.more}
                source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1/2026/01/26/2015620181947437056/1769396273853_766398.png' }} />
        </View>
    )
}

export default memo(Rank)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#ffebe6',
        paddingVertical: 6,
        paddingHorizontal: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    rankName: {
        fontSize: 18,
        color: '#ff4e1b',
        fontWeight: 'bold',
    },
    rankIcon: {
        height: '100%',
        width: 12,
    },
    rankDesc: {
        color: '#ac4646',
        flex: 1,
        marginLeft: 4,
    },
    more: {
        width: 12,
        height: 12
    }
})