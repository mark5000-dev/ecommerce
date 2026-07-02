// src/app/provider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken } from "@/lib/api";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 }
    }
});

// Explicit local auth state type
interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (val: boolean) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sync token state instantly on initial load
        const token = getToken();
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
                {children}
            </AuthContext.Provider>
        </QueryClientProvider>
    );
}

export const useAuthState = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthState must be used within Providers");
    return context;
};