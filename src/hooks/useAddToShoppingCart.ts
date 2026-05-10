import { useCallback, useEffect, useState } from "react";
import { addToShoppingCart } from "../service/iGoService";

export function useAddToShoppingCart() {
    const [succeed, setSucceed] = useState(false);
    const [error, setError] = useState('');
    const [specId, setSpecId] = useState('');
    const [offerName, setOfferName] = useState('');
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (count <= 0 || !specId) {
            return;
        }
        const loadData = async () => {
            try {
                setError('')
                setSucceed(false);
                const data = await addToShoppingCart({
                    orderBusiInfo: [{
                        busiType: 'N1',
                        terminalList: [{
                            specId, // mcdsId
                            offerName, //this.skuInfo.showName || this.skuInfo.name,
                            number: count,
                            offerAttrList: []
                        }]
                    }],
                    // pageId: "P00000010882"

                });
                if (data.data === true && data.msg === 'success') {
                    setSucceed(true);
                } else {
                    setError(data.msg);
                }
            } catch (err: unknown) {
                setError(`${err}`);
            }
        }

        loadData();

    }, [specId, offerName, count]);

    const setCart = useCallback((id: string, name: string, cnt: number) => {
        setSpecId(id);
        setOfferName(name);
        setCount(cnt);
    }, []);


    return {
        succeed,
        error,
        setCart,
    }

}