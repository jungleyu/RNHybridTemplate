import { useCallback, useEffect, useState } from "react";
import { getEvaluationList } from "../service/iGoService";

export type CommentsParams = {
    pageNum: number, pageSize: number, skuIds: string[], sortType: number
}

export type CommentsResp = {
    current: number,
    pages: number,
    size: number,
    total: number,
    records: { [key: string]: number | string | null }[]
}

export default function useComments(params: CommentsParams, isLoadMore?: boolean) {
    const [data, setData] = useState<CommentsResp | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const { pageNum, pageSize, skuIds, sortType } = params;

    const resetData = useCallback(() => {
        setData(null)
    }, []);

    useEffect(() => {
        if (!skuIds.length) {
            return;
        }
        const loadData = async () => {
            console.log('useComments: ', pageNum, pageSize, skuIds, sortType)
            setLoading(true);
            setError(null);
            try {
                const detailData = await getEvaluationList(pageNum, pageSize, skuIds, sortType);
                if (isLoadMore) {
                    setData((prev) => {
                        return { ...detailData, records: [...(prev?.records ?? []), ...detailData?.records] }
                    });
                } else {
                    setData(detailData);
                }
            } catch (err: unknown) {
                setError(err);
            } finally {
                setLoading(false)
            }
        }
        loadData();

    }, [pageNum, pageSize, skuIds, sortType, isLoadMore]);


    return {
        data,
        loading,
        error,
        resetData
    }
}