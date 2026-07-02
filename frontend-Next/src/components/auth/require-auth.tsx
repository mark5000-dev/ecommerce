// src/components/auth/require-auth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthState } from "@/app/provider";

export function RequireAuth({ children, fallback, redirectTo = "/auth/login" }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading } = useAuthState();
  
  // 1. Add a mounting safeguard state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Fired only on the client browser after initial hydration pass
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      const queryStr = searchParams.toString();
      const currentPath = queryStr ? `${pathname}?${queryStr}` : pathname;
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [mounted, isAuthenticated, loading, pathname, searchParams, redirectTo, router]);

  // 2. While server is rendering or client is hydrating, strictly match the server's loading UI
  if (!mounted || loading) {
    return fallback || (
      <div className="min-h-[80vh] flex items-center justify-center bg-background">
        <div className="h-8 w-8 border border-t-[#D4AF37] animate-spin rounded-full" />
      </div>
    );
  }

  if(isAuthenticated) {
    console.log("User is authenticated, rendering children.");
    return <>{children}</>; // Renders children if authenticated
  }

};