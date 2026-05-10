import { useEffect, useState } from "react";
import { getRightsMarket } from "../service/iGoService";

type IData = {goodsList: Record<string, any>, webpBgImg?: string, textColor?: string, textBgColor?: string}

export function useRightsMarket() {
    const [data, setData] = useState<IData>({
        goodsList: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await getRightsMarket();
                setData(result)
            } catch (err: unknown) {
                setError(err);
            } finally {
                setLoading(false)
            }
        }

        loadData();

    }, []);


    return {
        data,
        loading,
        error,
    }

}