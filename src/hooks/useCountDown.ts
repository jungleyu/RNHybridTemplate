import { useCallback, useEffect, useState } from "react";

export default function useCountDown(defaultCount = 60) {
    const [count, setCount] = useState(0);
    const isRunning = count > 0;

    const start = useCallback((sec = defaultCount) => {
        setCount(sec);
    }, [defaultCount]);

    const reset = useCallback(() => {
        setCount(0);
    }, []);

    useEffect(() => {
        if (count <= 0) {
            return;
        }
        const timer = setTimeout(() => {
            setCount(prev => {
                if (prev <= 1) {
                    clearTimeout(timer);
                    return 0
                }
                return prev - 1
            })
        }, 1000);
        return () => {
            clearTimeout(timer);
        }
    }, [count])

    return {
        count,
        isRunning,
        reset,
        start,
    }
}