"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, themes } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Loader2 } from "lucide-react";

export default function AuthPage() {
    const router = useRouter();
    const { login, signup } = useAuth();
    const { currentColors } = useTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await login(loginData.email, loginData.password);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            router.push("/");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await signup(signupData.name, signupData.email, signupData.password);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="flex items-center justify-center p-6" style={{ minHeight: "100vh" }}>
            <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border-slate-700 shadow-2xl">
                <div className="p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                                }}
                            >
                                <Eye className="w-7 h-7 text-white" />
                            </div>
                            <span
                                className="text-3xl font-bold"
                                style={{
                                    background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text"
                                }}
                            >
                                Iris
                            </span>
                        </div>
                    </div>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Login Tab */}
                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4 mt-6">
                                <div>
                                    <label className="text-sm text-slate-300 mb-2 block">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="bg-slate-700/50 border-slate-600 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-300 mb-2 block">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="bg-slate-700/50 border-slate-600 text-white"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full hover:opacity-90"
                                    style={{
                                        background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Signup Tab */}
                        <TabsContent value="signup">
                            <form onSubmit={handleSignup} className="space-y-4 mt-6">
                                <div>
                                    <label className="text-sm text-slate-300 mb-2 block">Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Your Name"
                                        value={signupData.name}
                                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                        className="bg-slate-700/50 border-slate-600 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-300 mb-2 block">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={signupData.email}
                                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                        className="bg-slate-700/50 border-slate-600 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-300 mb-2 block">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                        className="bg-slate-700/50 border-slate-600 text-white"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full hover:opacity-90"
                                    style={{
                                        background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}
