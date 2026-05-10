import * as Crypto from "crypto-js"

export function decrypt(cipherText: string = '', latin1Str = '') {
    let secretKey = Crypto.enc.Latin1.parse("1de23e756aaf3cc2");
    let iv = Crypto.enc.Latin1.parse("1de23e756aaf3cc2");

    if (latin1Str) {
        secretKey = Crypto.enc.Utf8.parse(latin1Str);
        iv = Crypto.enc.Utf8.parse(latin1Str);
    }

    let result = Crypto.AES.decrypt(cipherText, secretKey, {
        iv,
        padding: Crypto.pad.ZeroPadding
    });
    return result.toString(Crypto.enc.Utf8)
}