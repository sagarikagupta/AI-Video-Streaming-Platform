"use client";

import { useTheme, themes, Theme } from "@/contexts/ThemeContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export default function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="border-slate-600 hover:bg-slate-800">
                    <Palette className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                {Object.entries(themes).map(([key, value]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => setTheme(key as Theme)}
                        className={`cursor-pointer ${theme === key ? "bg-slate-700" : ""
                            } hover:bg-slate-700`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: value.colors.primary }}
                            />
                            <span className="text-slate-200">{value.name}</span>
                            {theme === key && <span className="ml-auto text-xs">✓</span>}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
