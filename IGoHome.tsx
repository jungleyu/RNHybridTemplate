import { useCallback, useContext } from "react";
import { Pressable, StyleSheet, Text, View, } from "react-native";
import { CounterContext } from "./CounterContext";
import Navigation from './specs/NativeNavigation';

export default function IGoHome() {
    const { count, increment, decrement } = useContext(CounterContext);
    const toDetail = useCallback(() => {
        Navigation.navigate('Detail')
    }, []);
    return <View style={styles.page}>
        <Text style={styles.bold}>Hello, 我是RN主页</Text>
        <Pressable style={styles.btn} onPress={toDetail}>
            <Text>点击跳转详情页</Text>
        </Pressable>
        <Text style={styles.bold}>{`当前计数: ${count}`}</Text>
        <Pressable style={styles.btn} onPress={increment}>
            <Text>+1</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={decrement}>
            <Text>-1</Text>
        </Pressable>
    </View>
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
        padding: 8,
        backgroundColor: '#eee'
    }
})