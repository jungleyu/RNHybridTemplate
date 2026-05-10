import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { userLoginV2 } from "../service/iGoService";
import { authStorage } from "../utils/Storage";

export interface User {
    id: string;
    email?: string;
    name?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (params: Record<string, any>) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const loadAuthFromLocal = useCallback(async () => {
        const authInfo = await authStorage.getMany(['phone', 'phoneMask']);
        if (authInfo.phone) {
            setUser({
                id: 'test',
                name: authInfo.phoneMask || '',
            })
        }
    }, [])

    useEffect(() => {
        loadAuthFromLocal();
    }, [loadAuthFromLocal]);

    const login = useCallback(async (params: Record<string, string>) => {
        setLoading(true);
        return userLoginV2(params).then((resp) => {
            if (resp.data?.code === '0') {
                const data = resp.data?.data || {};
                setUser({
                    id: 'mockIdFromServer',
                    name: data.mobileMask,
                });
                authStorage.setMany({
                    phone: data.token,
                    phoneMask: data.mobileMask,
                    refreshToken: data.refreshToken,
                });
            }
        }).finally(() => {
            setLoading(false);
        })

    }, []);

    const logout = useCallback(() => {
        setUser(null)
    }, [])

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout
    }), [user, loading, login, logout])

    return <AuthContext value={value}>
        {children}
    </AuthContext>
}