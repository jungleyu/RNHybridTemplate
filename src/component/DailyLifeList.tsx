import { Text, ImageBackground, FlatList, Image, StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import { TouchableRipple } from 'react-native-paper';
import { useRightsMarket } from '../hooks/useRightsMarket';

const DailyLifeList = () => {
    const { data, error } = useRightsMarket();
    const { textBgColor, textColor } = data ?? {};

    const renderDailyLifeItem = useCallback(({ item }: { item: { desc: string, img: string } }) => {
        return <TouchableRipple style={[styles.dailyLifeItem, textBgColor ? { backgroundColor: textBgColor } : null]}>
            <>
                <Image style={styles.dailyLifeItemImg} source={{ uri: item.img }} />
                <Text style={[styles.dailyLifeItemText, textColor ? { color: textColor } : null]}>{item.desc}</Text>
            </>
        </TouchableRipple>
    }, [textBgColor, textColor]);

    if (!(data?.goodsList ?? []).length || error) {
        return null;
    }
    return (
        <ImageBackground style={styles.dailyLife} resizeMode='contain' source={{ uri: data.webpBgImg }}>
            <FlatList
                contentContainerStyle={styles.dailyLifeList}
                //@ts-ignore
                data={data.goodsList}
                renderItem={renderDailyLifeItem}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </ImageBackground>
    )
}

export default DailyLifeList

const styles = StyleSheet.create({
    dailyLife: {
        height: 150,
        borderRadius: 18,
    },
    dailyLifeList: {
        paddingHorizontal: 12,
        alignItems: 'flex-end',
        paddingBottom: 18,
        gap: 12,
    },
    dailyLifeItem: {
        alignItems: 'center',
        backgroundColor: 'rgb(255, 239, 231)',
        borderRadius: 6,
    },
    dailyLifeItemImg: {
        width: 60,
        height: 60
    },
    dailyLifeItemText: {
        fontSize: 14,
        marginTop: 4,
    },
})