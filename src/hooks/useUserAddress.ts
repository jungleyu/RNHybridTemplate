import { useEffect, useState } from "react";
import { getUserAddress } from "../service/iGoService";

type UserAddress = {
    addressId: string,
    city: string,
    defaulted: number,
    detailAddress: string,
    district: string,
    province: string,
}

export default function useUserAddress() {
    const [address, setAddress] = useState<UserAddress[] | null>(null);

    useEffect(() => {
        const loadData = async function loadUserAddress() {
            try {
                const data = await getUserAddress();
                setAddress(data)
            } catch {

            }
        }
        loadData();
    }, []);

    return {
        address
    }
}