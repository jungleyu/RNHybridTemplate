import { useEffect, useState } from "react";
import { getSpecInfo } from "../service/iGoService";
import { SkuItem, SpecItem } from "../utils/skuUtils";

export function useSpecInfo(mid: string) {
    const [data, setData] = useState<{ skuList: SkuItem[], specList: SpecItem[], spuInfo: Record<string, string> }>({ skuList: [], specList: [], spuInfo: {} });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const detailData = await getSpecInfo(mid);
            setData(detailData)
            setLoading(false)
        }
        try {
            loadData();
        } catch (err: unknown) {
            setError(err);
        }

    }, [mid]);


    return {
        data,
        loading,
        error,
    }

}