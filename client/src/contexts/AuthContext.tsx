"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    joinedDate: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(mapSupabaseUser(session.user));
            }
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(mapSupabaseUser(session.user));
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const mapSupabaseUser = (supabaseUser: SupabaseUser): User => {
        return {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "User",
            email: supabaseUser.email || "",
            avatar: supabaseUser.user_metadata?.avatar_url,
            joinedDate: supabaseUser.created_at || new Date().toISOString(),
        };
    };

    const login = async (email: string, password: string): Promise<{ error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { error: error.message };
            }

            if (data.user) {
                setUser(mapSupabaseUser(data.user));
            }

            return {};
        } catch (error: any) {
            return { error: error.message || "An error occurred during login" };
        }
    };

    const signup = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                    },
                },
            });

            if (error) {
                return { error: error.message };
            }

            if (data.user) {
                setUser(mapSupabaseUser(data.user));
            }

            return {};
        } catch (error: any) {
            return { error: error.message || "An error occurred during signup" };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
