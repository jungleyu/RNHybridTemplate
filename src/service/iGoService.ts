import axios from "axios";
import { md5 } from "js-md5";
import uuid from 'react-native-uuid';
import { authStorage } from "../utils/Storage";

const api = axios.create({
    timeout: 10000,
    baseURL: 'https://dev.coc.10086.cn',
    withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    const token = await authStorage.getItem('phone');
    if (token) {
        config.headers.phone = token;
    }
    return config
})

const nt: { [key: number]: string } = {
    1: "AizkkwOAWRVihbCs",
    2: "74yrUGGCWjvggMjtgSzQN0qVOJtwJUFt"
};

export function enCrypten(value: string, randomStr: string, key: number) {
    return md5(value + nt[key] + randomStr)
}

export async function sendInternetSmsWithSignByRSA(params: { businessType: string, p1: string, p2: string }) {
    const timestamp = (new Date).getTime();
    const randomStr = uuid.v4().replace(/-/g, "").substring(0, 10);
    return api.post('/coc3/gr/login/ssoRights/sendInternetSmsWithSignByRSA', params, {
        headers: {
            timestamp,
            randomStr,
            signature: enCrypten(`${timestamp}`, randomStr, 2)
        }
    })
}

export async function userLoginV2(params: Record<string, string>) {
    return api.post('/coc3/gr/login/ssoRights/userLoginV2', {
        "ticket": "MOBILE",
        "ticketType": 7,
        "businessType": "RIGHTS_MARKET",
        "wxoaType": "",
        "from": "",
        ...params
    })
}

export async function getProductByGroupId(params = {}) {
    const result = await api.get('/coc3/coc3-market/arrange/getProductByGroupId', {
        params,
    });
    const list = (result?.data?.data ?? []).map(({
        id,
        mid,
        name,
        showName,
        cdnUrl,
        price,
    }: Record<string, unknown>) => {
        return {
            id,
            mid,
            name,
            showName,
            cdnUrl,
            price,
        }
    })
    return Promise.resolve(list);
}

export async function getProductDetail(mid: string, skuId: string) {
    let productData = (await api.get('/coc3/coc3-market/api/salesPage/tangibleDetail', {
        params: {
            mid,
            skuId,
        }
    })).data?.data;

    const headImage = productData?.spuInfo?.headImages?.[0] ?? '';
    const name = productData?.skuInfo?.name ?? '';
    const price = productData?.skuInfo?.price ?? '';
    const salesCount = productData?.salesPageInfo?.volume ?? 0;
    const deliveryPeriod = productData?.spuInfo?.deliveryPeriod;
    const spec = productData?.skuInfo?.spec;
    const richText = productData?.spuInfo?.richText;
    const detailImages = productData?.spuInfo?.detailImages;
    const serviceGuarantees = productData?.spuInfo?.serviceGuarantees;
    const detailText = productData?.spuInfo?.detailText;
    const featureTag = productData?.spuInfo?.featureTag;
    return Promise.resolve({
        headImage,
        name,
        price,
        salesCount,
        deliveryPeriod,
        spec,
        richText,
        detailImages,
        serviceGuarantees,
        detailText,
        featureTag
    });
}

export async function getEvaluationList(pageNum: number = 1, pageSize: number = 10, skuIds: string[] = [], sortType: number = 0) {
    const resp = await api.post('/coc3/coc3-market-order/api/external/evaluation/skuEvaluationList', {
        pageNum, pageSize, skuIds, sortType
    }, {
        headers: {
            'Referer': 'https://dev.coc.10086.cn/'

        }
    })
    return Promise.resolve(resp.data.data);
}

export async function getSpecInfo(mid: string) {
    const result = await api.get('/coc3/coc3-market/api/salesPage/specInfo', {
        params: {
            mid
        }
    });
    return Promise.resolve(result.data?.data);
}

export async function getRightsMarket() {
    const result = await api.get(`https://res.coc.10086.cn/res/cdn/coc1/fixedPath/production.rightsmarket-h5-canvas.online.layout.home.json?tes=${Date.now()}`)
    let str = result.data?.instanceList?.[8]?.[0]?.instance?.specify ?? '{}';
    try {
        const data = JSON.parse(str);
        return Promise.resolve(data);
    } catch {
        return Promise.reject(new Error('Data error'))
    }
}

export async function getRankBySku(skuId: string) {
    const result = await api.get('/coc3/coc3-market/arrange/getRankBySku', {
        params: {
            skuId
        }
    });
    return Promise.resolve(result.data?.data);
}

export async function getUserAddress() {
    const token = await authStorage.getItem('phone');
    const resp = await api.post('/coc3/coc3-user-center/open/api/user/getUserAddress', {}, {
        headers: {
            token
        }
    });
    return Promise.resolve(resp.data?.data);
}

export async function addToShoppingCart(params: Record<string, unknown>) {
    const token = await authStorage.getItem('phone');

    const resp = await api.post('/coc3/coc3-market/api/market/external/shoppingCart/add', {
        userMobile: token,
        ...params
    })

    return Promise.resolve(resp.data);
}

export async function getShoppingCartList() {
    const token = await authStorage.getItem('phone');
    const resp = await api.post('/coc3/coc3-market/api/market/external/shoppingCart/list', {
        userMobile: token,
    });
    return Promise.resolve(resp.data);
}