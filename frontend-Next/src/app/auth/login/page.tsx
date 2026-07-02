"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginMutation } from "@/hooks/useAuth";
import { useAuthState } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock } from "lucide-react";

function LoginForm() {
const router = useRouter();
    const searchParams = useSearchParams();
    const { setIsAuthenticated } = useAuthState(); // 2. Grab the setter function
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [authError, setAuthError] = useState<string | null>(null);

    const loginMutation = useLoginMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);

        loginMutation.mutate(formData, {
            onSuccess: () => {
                // 3. Mark state authenticated synchronously BEFORE routing
                setIsAuthenticated(true); 
                
                // 4. Run the redirection safely
                const redirectTo = searchParams.get("redirect") || "/profile";
                router.push(redirectTo);
            },
            onError: (error: any) => {
                setAuthError(error?.message || "Invalid credentials provided. Please try again.");
            }
        });
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md border-border rounded-none bg-card shadow-none">
                <CardHeader className="space-y-2 pt-8 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 border border-[#D4AF37] flex items-center justify-center transform rotate-45">
                            <Lock className="h-5 w-5 text-[#D4AF37] -rotate-45" />
                        </div>
                    </div>
                    <CardTitle className="font-serif text-2xl md:text-3xl text-foreground tracking-tight">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground font-light">
                        Access your private luxury portfolio
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 px-6 sm:px-8">
                        {authError && (
                            <Alert className="border-destructive/20 bg-destructive/5 rounded-none p-3 animate-fade-in">
                                <AlertDescription className="text-destructive text-xs font-light">
                                    {authError}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-xs uppercase font-medium tracking-wider text-foreground">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                disabled={loginMutation.isPending}
                                value={formData.email}
                                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                                className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-[#D4AF37] h-10 text-sm"
                                placeholder="name@domain.com"
                            />
                        </div>

                        <div className="space-y-1 relative">
                            <div className="flex justify-between items-center mb-1">
                                <Label htmlFor="password" className="text-xs uppercase font-medium tracking-wider text-foreground">
                                    Password
                                </Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-[11px] text-muted-foreground hover:text-[#D4AF37] font-light transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    disabled={loginMutation.isPending}
                                    value={formData.password}
                                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                                    className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-[#D4AF37] h-10 pr-10 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-8 pt-4">
                        <Button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs font-semibold uppercase tracking-widest h-11 transition-colors"
                        >
                            {loginMutation.isPending ? "Verifying..." : "Sign In"}
                        </Button>

                        <div className="text-center text-xs text-muted-foreground font-light pt-2">
                            New to our maison?{" "}
                            <Link href="/auth/sign-up" className="text-foreground hover:text-[#D4AF37] underline underline-offset-4 transition-colors font-medium">
                                Create an account
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center bg-background" /> }>
            <LoginForm />
        </Suspense>
    );
}