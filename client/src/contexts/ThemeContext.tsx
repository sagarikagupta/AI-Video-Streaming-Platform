"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "default" | "ocean" | "forest" | "sunset" | "midnight" | "cyberpunk";

interface ThemeConfig {
    name: string;
    colors: {
        primary: string;
        primaryHover: string;
        secondary: string;
        accent: string;
        background: string;
        card: string;
        text: string;
    };
}

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    currentColors: ThemeConfig["colors"];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes: Record<Theme, ThemeConfig> = {
    default: {
        name: "Purple Dream",
        colors: {
            primary: "#a855f7", // brighter purple-500
            primaryHover: "#9333ea", // purple-600
            secondary: "#f472b6", // brighter pink-400
            accent: "#c084fc", // purple-400
            background: "linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)",
            card: "rgba(30, 41, 59, 0.5)",
            text: "#f1f5f9",
        },
    },
    ocean: {
        name: "Ocean Blue",
        colors: {
            primary: "#38bdf8", // brighter sky-400
            primaryHover: "#0284c7", // sky-600
            secondary: "#22d3ee", // brighter cyan-400
            accent: "#7dd3fc", // sky-300
            background: "linear-gradient(to bottom right, #0c4a6e, #1e3a8a, #0c4a6e)",
            card: "rgba(30, 58, 138, 0.4)",
            text: "#e0f2fe",
        },
    },
    forest: {
        name: "Forest Green",
        colors: {
            primary: "#34d399", // brighter emerald-400
            primaryHover: "#059669", // emerald-600
            secondary: "#6ee7b7", // brighter emerald-300
            accent: "#a7f3d0", // emerald-200
            background: "linear-gradient(to bottom right, #064e3b, #14532d, #064e3b)",
            card: "rgba(20, 83, 45, 0.4)",
            text: "#d1fae5",
        },
    },
    sunset: {
        name: "Sunset Orange",
        colors: {
            primary: "#fb923c", // brighter orange-400
            primaryHover: "#ea580c", // orange-600
            secondary: "#fbbf24", // brighter yellow-400
            accent: "#fcd34d", // yellow-300
            background: "linear-gradient(to bottom right, #7c2d12, #991b1b, #7c2d12)",
            card: "rgba(153, 27, 27, 0.4)",
            text: "#fed7aa",
        },
    },
    midnight: {
        name: "Midnight",
        colors: {
            primary: "#818cf8", // brighter indigo-400
            primaryHover: "#4f46e5", // indigo-600
            secondary: "#a78bfa", // brighter violet-400
            accent: "#c4b5fd", // violet-300
            background: "linear-gradient(to bottom right, #0f172a, #1e1b4b, #0f172a)",
            card: "rgba(30, 27, 75, 0.5)",
            text: "#e0e7ff",
        },
    },
    cyberpunk: {
        name: "Cyberpunk",
        colors: {
            primary: "#f472b6", // brighter pink-400
            primaryHover: "#ec4899", // pink-500
            secondary: "#facc15", // brighter yellow-400
            accent: "#fb7185", // rose-400
            background: "linear-gradient(to bottom right, #000000, #3b0764, #000000)",
            card: "rgba(59, 7, 100, 0.6)",
            text: "#fce7f3",
        },
    },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("default");

    useEffect(() => {
        const stored = localStorage.getItem("iris-theme") as Theme;
        if (stored && themes[stored]) {
            setThemeState(stored);
        }
    }, []);

    useEffect(() => {
        // Apply CSS variables
        const colors = themes[theme].colors;
        const root = document.documentElement;

        root.style.setProperty("--color-primary", colors.primary);
        root.style.setProperty("--color-primary-hover", colors.primaryHover);
        root.style.setProperty("--color-secondary", colors.secondary);
        root.style.setProperty("--color-accent", colors.accent);
        root.style.setProperty("--color-text", colors.text);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("iris-theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, currentColors: themes[theme].colors }}>
            <div style={{ background: themes[theme].colors.background, minHeight: "100vh" }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
