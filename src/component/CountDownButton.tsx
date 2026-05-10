import React, { FC, useCallback, } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper';
import useCountDown from '../hooks/useCountDown';

export type CountDownButtonProps = {
    text?: string,
    prefixText?: string,
    countDown?: number,
    onPress?: () => void,
    style?: StyleProp<ViewStyle>
}

const CountDownButton: FC<CountDownButtonProps> = ({
    text = '获取验证码',
    prefixText = '重新获取',
    countDown = 60,
    onPress,
    style
}) => {
    const {
        start,
        isRunning,
        count
    } = useCountDown(countDown);

    const startCountDown = useCallback(() => {
        start(countDown);
        onPress?.();
    }, [countDown, start, onPress]);

    return <Button
        disabled={isRunning}
        mode='contained'
        style={[styles.btn, isRunning ? styles.disabledBg : null, style]}
        labelStyle={isRunning ? styles.disabledLabel : {}}
        onPress={startCountDown}>{isRunning ? `${prefixText}${count}s` : text}</Button>
}

export default CountDownButton

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#6696ff'
    },
    disabledBg: {
        backgroundColor: '#f4f5f6'
    },
    disabledLabel: {
        color: '#999'
    }
})