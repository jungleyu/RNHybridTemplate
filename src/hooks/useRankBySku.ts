import { useEffect, useState } from "react";
import { getRankBySku } from "../service/iGoService";

export function useRankBySku(skuId: string) {
    const [rank, setRank] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await getRankBySku(skuId);
                setRank(data)
            } catch (err: unknown) {
                setError(err);
            } finally {
                setLoading(false)
            }
        }

        loadData();

    }, [skuId]);


    return {
        rank,
        loading,
        error,
    }

}