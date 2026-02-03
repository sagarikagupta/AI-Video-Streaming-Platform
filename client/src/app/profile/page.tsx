"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme, themes } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockWatchHistory, mockCreateHistory } from "@/lib/mockData";
import { Calendar, Eye, Video, Clock } from "lucide-react";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const { currentColors } = useTheme();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth");
        }
    }, [isAuthenticated, router]);

    if (!user) return null;

    const joinedDate = new Date(user.joinedDate).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Profile Header */}
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700">
                    <div className="p-8">
                        <div className="flex items-start gap-6">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback
                                    className="text-white text-3xl"
                                    style={{
                                        background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                                    }}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                                <p className="text-slate-400 mb-4">{user.email}</p>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Joined {joinedDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tabs */}
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700">
                    <Tabs defaultValue="history" className="w-full">
                        <div className="border-b border-slate-700">
                            <TabsList className="bg-transparent p-0 h-auto">
                                <TabsTrigger
                                    value="history"
                                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-6 py-4"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Watch History
                                </TabsTrigger>
                                <TabsTrigger
                                    value="created"
                                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-6 py-4"
                                >
                                    <Video className="w-4 h-4 mr-2" />
                                    Created Streams
                                </TabsTrigger>
                                <TabsTrigger
                                    value="settings"
                                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-6 py-4"
                                >
                                    Settings
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Watch History */}
                        <TabsContent value="history" className="p-6">
                            <div className="space-y-4">
                                {mockWatchHistory.map((stream) => (
                                    <div
                                        key={stream.id}
                                        className="flex gap-4 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                                    >
                                        <img
                                            src={stream.thumbnail}
                                            alt={stream.title}
                                            className="w-48 h-27 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold mb-1">{stream.title}</h3>
                                            <p className="text-sm text-slate-400 mb-2">{stream.streamer}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {stream.viewCount.toLocaleString()} views
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {stream.duration}
                                                </div>
                                                <span>{new Date(stream.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Created Streams */}
                        <TabsContent value="created" className="p-6">
                            <div className="space-y-4">
                                {mockCreateHistory.map((stream) => (
                                    <div
                                        key={stream.id}
                                        className="flex gap-4 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                                    >
                                        <img
                                            src={stream.thumbnail}
                                            alt={stream.title}
                                            className="w-48 h-27 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold mb-1">{stream.title}</h3>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {stream.viewCount.toLocaleString()} views
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {stream.duration}
                                                </div>
                                                <span>{new Date(stream.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Settings */}
                        <TabsContent value="settings" className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-slate-400 mb-2 block">Display Name</label>
                                            <input
                                                type="text"
                                                value={user.name}
                                                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-400 mb-2 block">Email</label>
                                            <input
                                                type="email"
                                                value={user.email}
                                                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-slate-700" />

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                                    <p className="text-sm text-slate-400">
                                        Theme preferences are managed via the theme selector in the navigation bar.
                                    </p>
                                </div>

                                <Separator className="bg-slate-700" />

                                <div>
                                    <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                                    <Button variant="destructive">Delete Account</Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
