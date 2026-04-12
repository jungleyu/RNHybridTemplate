import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CounterContext } from "./CounterContext";

export default function IGoDetail(props: any) {
    console.log('[IGoDetail]: ', props)
    const { count, } = useContext(CounterContext);
    return <View style={styles.page}>
        <Text style={styles.bold}>Hello, 我是RN详情页</Text>
        <Text style={styles.bold}>{`我这边看到的数量是: ${count}`}</Text>
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
})