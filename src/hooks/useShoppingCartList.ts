import { useEffect, useState } from "react";
import { getShoppingCartList } from "../service/iGoService";

type CartItem = {
    thumbnail: string,
    offerName: string,
    specId: string,
    isUseBean: boolean,
    mcdsDesc: string,
    discountPrice: number,
    vipPrice?: number,
    number: number,
    mid: string,
    skuId: string,
    shopName?: string,
    shopLogoUrl?: string,
}

export default function useShoppingCartList() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<CartItem[] | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await getShoppingCartList();
                if (result.data && Array.isArray(result.data?.aggregationShoppingCartItemList)) {
                    setData(() => {
                        return result.data?.aggregationShoppingCartItemList.reduce((memo: CartItem[], cartItem: { offerInfoList: (CartItem & Record<string, any>)[], shopInfo: { shopName?: string, shopLogoUrl?: string } }) => {
                            if (Array.isArray(cartItem.offerInfoList)) {
                                const shopName = cartItem.shopInfo?.shopName;
                                const shopLogoUrl = cartItem.shopInfo?.shopLogoUrl;
                                cartItem.offerInfoList.forEach((rawItem) => {
                                    const { discountPrice, isUseBean, mcdsDesc, mcdsUrlInfo, number, offerName, specId, vipPrice } = rawItem;
                                    let mcdsDescStr = '';
                                    try {
                                        let mcd = JSON.parse(mcdsDesc);
                                        mcdsDescStr = Object.values(mcd).join('; ');
                                    } catch { }
                                    const dp = Number(discountPrice) / 100;
                                    const mcdInfo = Array.isArray(mcdsUrlInfo) ? mcdsUrlInfo[0] ?? {} : {}
                                    const detailUrl = new URL(mcdInfo.mcdsDetailUrl ?? '');
                                    const skuId = detailUrl.searchParams.get('skuId') ?? '';
                                    const mid = detailUrl.searchParams.get('mid') ?? '';

                                    const item: CartItem = {
                                        discountPrice: dp,
                                        isUseBean: Boolean(isUseBean),
                                        number: Number(number),
                                        mcdsDesc: mcdsDescStr,
                                        thumbnail: mcdInfo?.thumbnailImgUrl ?? '',
                                        offerName,
                                        specId,
                                        vipPrice: vipPrice ? Number(vipPrice) / 100 : dp,
                                        skuId,
                                        mid,
                                    }
                                    if (shopName) {
                                        item.shopName = shopName
                                    }
                                    if (shopLogoUrl) {
                                        item.shopLogoUrl = shopLogoUrl
                                    }
                                    memo.push(item);
                                })
                            }
                            return memo;
                        }, [])
                    })
                }
            } catch { }
            finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return {
        data,
        loading
    }
}