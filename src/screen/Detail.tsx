import { useCallback, useContext } from "react";
import { StyleSheet, Text, } from "react-native";
import { CounterContext } from "../store/CounterContext";
import { StackActions, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";

export default function Detail() {
    const navigation = useNavigation();
    const toNextPage = useCallback((pageId: string) => {
        navigation.dispatch(StackActions.push(pageId))
    }, [navigation])

    const { count, } = useContext(CounterContext);
    return <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.bold}>Hello, 我是RN详情页</Text>
        <Text style={styles.bold}>{`我这边看到的数量是: ${count}`}</Text>

        <Button mode="outlined" style={styles.btn} onPress={() => toNextPage('Detail')}>点击我跳转到下一个页面</Button>
        <Button mode="outlined" style={styles.btn} onPress={() => toNextPage('WebView')}>点击我跳转到WebView页面</Button>
        <Button mode="outlined" style={styles.btn} onPress={() => toNextPage('ShoppingCart')}>点击我跳转到购物车</Button>
    </ScrollView>
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bold: {
        fontWeight: '700',
    },
    btn: {
        marginVertical: 12,
        paddingVertical: 4,
    }
})