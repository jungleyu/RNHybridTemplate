import { View, StyleSheet, Image, ToastAndroid, TextInput as RNTextInput } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { useAuth } from '../store/AuthContext'
import { StackActions, useNavigation } from '@react-navigation/native'
import JSEncrypt from 'jsencrypt'
import { md5 } from 'js-md5'
import { enCrypten, sendInternetSmsWithSignByRSA, } from '../service/iGoService'
import CountDownButton from '../component/CountDownButton'

function sendCodeRSAEncrypt(value: string): { p1: string, p2: string } {
    const crypt = new JSEncrypt();
    crypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmkt6XMYlmYIHn8aH5Dny3rlPV4oC3+GcvKYK7rBVGPKcHLJ7obH94qIhV0RWzGEdYkI0C5z9nc2jFNKudYYcTF2RHCybkXCstg+Jd7MfdWBTyVoMI7s5JKIVqBXXfqcu0/TjwPRYx5UTy2MmVzbN1dmK1Zp5WEIYtUPfse7tr4wIDAQAB");
    const encrypt = crypt.encrypt(value);
    console.log(encrypt)
    return {
        p1: encrypt as string,
        p2: md5(`${value}AizkkwOAWRVihbCs${encrypt}`)
    }
}

const Login = () => {
    const [phone, setPhone] = useState('');
    const [smsCode, setSMSCode] = useState('');
    const smsInputRef = useRef<RNTextInput>(null);
    const navigation = useNavigation();
    const { login } = useAuth();
    const doLogin = useCallback(() => {
        //@ts-ignore
        const encodedPhone = globalThis.btoa(phone).split("").reverse().join("");
        //@ts-ignore
        const encodedSMS = globalThis.btoa(smsCode).split("").reverse().join("");
        const phoneP1 = sendCodeRSAEncrypt(encodedPhone).p1;
        const smsP1 = sendCodeRSAEncrypt(encodedSMS).p1;
        login({
            m1: phoneP1,
            m2: enCrypten(phone, encodedPhone, 1),
            s1: smsP1,
            s2: enCrypten(smsCode, encodedSMS, 1),
        }).then(() => {
            navigation.dispatch(StackActions.replace('Home'));
        })
    }, [phone, smsCode, login, navigation]);

    const getSMSCode = useCallback(() => {
        const encrypted = sendCodeRSAEncrypt(phone);
        console.log(encrypted);

        smsInputRef.current?.focus();

        sendInternetSmsWithSignByRSA({
            businessType: 'NEW_RIGHTS_PORTAL',
            ...encrypted
        }).then(resp => {
            if (resp?.data?.code === '0') {
                ToastAndroid.show('验证码已发送，请注意查收', 2000)
            } else {
                ToastAndroid.show(resp?.data?.message ?? '验证码发送失败', 2000)
            }
        });
    }, [phone]);

    return (
        <View style={styles.page}>
            <Image style={styles.logo} source={{ uri: 'https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/coc3/rightsmarket-h5-canvas/img/login-logo.webp' }} />
            <View style={styles.row}>
                <TextInput style={styles.input} keyboardType='phone-pad' placeholder='请输入您的移动/联通/电信手机号码' onChangeText={setPhone} underlineStyle={styles.underline} />
            </View>
            <View style={styles.row}>
                <TextInput ref={smsInputRef} style={styles.input} placeholder='获取验证码' keyboardType='number-pad' underlineStyle={styles.underline} onChangeText={setSMSCode} />
                <CountDownButton style={styles.smsBtn} onPress={getSMSCode} />
            </View>
            <Button style={styles.loginBtn} mode='contained' onPress={doLogin}>登录</Button>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 22
    },
    logo: {
        width: 76,
        height: 76,
        alignSelf: 'center',
        marginBottom: 48,
    },
    input: {
        marginVertical: 8,
        height: 44,
        backgroundColor: '#FFF',
        flex: 1
    },
    smsBtn: {
        marginLeft: 16,
    },
    loginBtn: {
        marginTop: 20,
        backgroundColor: '#6696ff',
    },
    underline: {
        height: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})