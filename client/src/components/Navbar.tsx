"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, themes } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeSelector from "./ThemeSelector";
import { Video, Eye, User, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout, isAuthenticated } = useAuth();
    const { currentColors } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { href: "/create", label: "Create", icon: Video },
        { href: "/watch", label: "Watch", icon: Eye },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                                background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                            }}
                        >
                            <Eye className="w-5 h-5 text-white" />
                        </div>
                        <span
                            className="text-2xl font-bold"
                            style={{
                                background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}
                        >
                            Iris
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive
                                        ? "text-white"
                                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                                        }`}
                                    style={isActive ? { backgroundColor: currentColors.primary } : {}}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <ThemeSelector />

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar>
                                            <AvatarFallback
                                                style={{
                                                    background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                                                    color: "white"
                                                }}
                                            >
                                                {user?.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                                    <div className="px-2 py-2">
                                        <p className="text-sm font-medium text-white">{user?.name}</p>
                                        <p className="text-xs text-slate-400">{user?.email}</p>
                                    </div>
                                    <DropdownMenuSeparator className="bg-slate-700" />
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-700">
                                        <Link href="/profile" className="flex items-center text-slate-200">
                                            <User className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-700">
                                        <Link href="/profile?tab=settings" className="flex items-center text-slate-200">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-700" />
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="cursor-pointer hover:bg-slate-700 text-red-400"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/auth">
                                <Button
                                    style={{
                                        background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                                    }}
                                    className="hover:opacity-90"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isActive
                                        ? "text-white"
                                        : "text-slate-300 hover:bg-slate-800"
                                        }`}
                                    style={isActive ? { backgroundColor: currentColors.primary } : {}}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </nav>
    );
}
