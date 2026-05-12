import {
    AES,
    enc,
    pad
} from "crypto-js"

export function decrypt(cipherText: string = '', latin1Str = '') {
    let secretKey = enc.Latin1.parse("1de23e756aaf3cc2");
    let iv = enc.Latin1.parse("1de23e756aaf3cc2");

    if (latin1Str) {
        secretKey = enc.Utf8.parse(latin1Str);
        iv = enc.Utf8.parse(latin1Str);
    }

    let result = AES.decrypt(cipherText, secretKey, {
        iv,
        padding: pad.ZeroPadding
    });
    return result.toString(enc.Utf8)
}