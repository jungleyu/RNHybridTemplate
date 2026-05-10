import { useEffect, useState } from "react";
import { getProductDetail } from "../service/iGoService";

export function useProductDetail(mid: string, skuId: string) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const detailData = await getProductDetail(mid, skuId);
                setData(detailData)
            } catch (err: unknown) {
                setError(err);
            } finally {
                setLoading(false)
            }
        }

        loadData();

    }, [mid, skuId]);


    return {
        data,
        loading,
        error,
    }

}