"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus } from "lucide-react";

function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [authError, setAuthError] = useState<string | null>(null);

    const registerMutation = useRegisterMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);

        if (formData.password !== formData.confirmPassword) {
            setAuthError("Password verification conflict. Entered strings must correspond exactly.");
            return;
        }

        const { confirmPassword, ...payload } = formData;

        registerMutation.mutate(payload, {
            onSuccess: () => {
                const redirectTo = searchParams.get("redirect") || "/profile";
                router.push(redirectTo);
            },
            onError: (error: any) => {
                setAuthError(error?.message || "Failed to create account profile.");
            }
        });
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-lg border-border rounded-none bg-card shadow-none">
                <CardHeader className="space-y-2 pt-8 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 border border-[#D4AF37] flex items-center justify-center transform rotate-45">
                            <UserPlus className="h-5 w-5 text-[#D4AF37] -rotate-45" />
                        </div>
                    </div>
                    <CardTitle className="font-serif text-2xl md:text-3xl text-foreground tracking-tight">
                        Create Profile Node
                    </CardTitle>
                    <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground font-light">
                        Register for archival member benefits & exclusive tier rewards
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 px-6 sm:px-8">
                        {authError && (
                            <Alert className="border-destructive/20 bg-destructive/5 rounded-none p-3">
                                <AlertDescription className="text-destructive text-xs font-light">
                                    {authError}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="firstName" className="text-xs uppercase font-medium tracking-wider text-foreground">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    required
                                    disabled={registerMutation.isPending}
                                    value={formData.firstName}
                                    onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                                    className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-[#D4AF37] h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="lastName" className="text-xs uppercase font-medium tracking-wider text-foreground">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    required
                                    disabled={registerMutation.isPending}
                                    value={formData.lastName}
                                    onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                                    className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-[#D4AF37] h-10 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-xs uppercase font-medium tracking-wider text-foreground">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                disabled={registerMutation.isPending}
                                value={formData.email}
                                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                                className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-[#D4AF37] h-10 text-sm"
                                placeholder="name@domain.com"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-xs uppercase font-medium tracking-wider text-foreground">
                                Password Strength
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                disabled={registerMutation.isPending}
                                value={formData.password}
                                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                                className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-[#D4AF37] h-10 text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword" className="text-xs uppercase font-medium tracking-wider text-foreground">
                                Verify Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                disabled={registerMutation.isPending}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                                className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-[#D4AF37] h-10 text-sm"
                            />
                        </div>

                        <div className="flex items-start space-x-2 pt-2">
                            <Checkbox id="terms" required className="rounded-none border-border mt-0.5 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-black" />
                            <Label htmlFor="terms" className="text-xs text-muted-foreground font-light leading-normal">
                                I agree to the Maison terms of compliance service framework and implicit private tracking policies.
                            </Label>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-8 pt-4">
                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs font-semibold uppercase tracking-widest h-11 transition-colors"
                        >
                            {registerMutation.isPending ? "Creating Identity..." : "Establish Account Profile"}
                        </Button>

                        <div className="text-center text-xs text-muted-foreground font-light pt-2">
                            Already have an archival access slot?{" "}
                            <Link href="/auth/login" className="text-foreground hover:text-[#D4AF37] underline underline-offset-4 transition-colors font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="min-h-[90vh] flex items-center justify-center bg-background" /> }>
            <SignUpForm />
        </Suspense>
    );
}