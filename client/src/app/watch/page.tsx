"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const featuredStreams = [
    {
        id: "1",
        title: "Full Stack Development - Building a Real-Time App",
        streamer: "CodeMaster",
        thumbnail: "/stream1.png",
        viewers: 2847,
        category: "Programming",
        isLive: true,
        isAI: true,
    },
    {
        id: "2",
        title: "AI/ML Workshop - Neural Networks Deep Dive",
        streamer: "AIExpert",
        thumbnail: "/stream2.png",
        viewers: 3156,
        category: "AI/ML",
        isLive: true,
        isAI: true,
    },
    {
        id: "3",
        title: "WebRTC Deep Dive - Real-time Communication",
        streamer: "TechGuru",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
        viewers: 1856,
        category: "Technology",
        isLive: true,
        isAI: true,
    },
    {
        id: "4",
        title: "React Performance Optimization Masterclass",
        streamer: "ReactNinja",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
        viewers: 2145,
        category: "Web Dev",
        isLive: true,
        isAI: true,
    },
    {
        id: "5",
        title: "Database Design Patterns & Best Practices",
        streamer: "DataPro",
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop",
        viewers: 1278,
        category: "Database",
        isLive: true,
        isAI: true,
    },
    {
        id: "6",
        title: "Game Development with Unity - RPG Tutorial",
        streamer: "GameDev",
        thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=225&fit=crop",
        viewers: 3421,
        category: "Game Dev",
        isLive: true,
        isAI: true,
    },
    {
        id: "7",
        title: "DevOps & Cloud Infrastructure with Kubernetes",
        streamer: "CloudGuru",
        thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=225&fit=crop",
        viewers: 1689,
        category: "DevOps",
        isLive: true,
    },
    {
        id: "8",
        title: "Cybersecurity Fundamentals - Ethical Hacking",
        streamer: "SecPro",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop",
        viewers: 2234,
        category: "Security",
        isLive: true,
    },
    {
        id: "9",
        title: "Mobile App Development - Flutter & Dart",
        streamer: "MobileDev",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop",
        viewers: 1567,
        category: "Mobile",
        isLive: true,
    },
];

export default function WatchPage() {
    const { currentColors } = useTheme();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStreams = searchQuery
        ? featuredStreams.filter(
            (stream) =>
                stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                stream.streamer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                stream.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : featuredStreams;

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1
                        className="text-4xl font-bold mb-4"
                        style={{
                            background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text"
                        }}
                    >
                        Discover Live Streams
                    </h1>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search for streams, streamers, or topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {["All", "Programming", "AI/ML", "Web Dev", "Database", "Game Dev", "DevOps", "Security", "Mobile"].map((category) => (
                        <Badge
                            key={category}
                            variant="outline"
                            className="cursor-pointer hover:bg-slate-700 border-slate-600 text-slate-300 whitespace-nowrap"
                            style={{
                                borderColor: currentColors.accent + "40",
                            }}
                        >
                            {category}
                        </Badge>
                    ))}
                </div>

                {/* Live Streams Grid */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5" style={{ color: currentColors.accent }} />
                        <h2 className="text-2xl font-bold text-white">Live Now</h2>
                        <Badge className="bg-red-600 hover:bg-red-600 text-white ml-2">
                            {filteredStreams.length} streams
                        </Badge>
                    </div>

                    {filteredStreams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStreams.map((stream) => (
                                <Card
                                    key={stream.id}
                                    className="overflow-hidden hover:border-slate-600 transition-all cursor-pointer group"
                                    style={{
                                        backgroundColor: currentColors.card,
                                        borderColor: "#475569",
                                    }}
                                    onClick={() => router.push(`/stream/${stream.id}`)}
                                >
                                    <div className="relative">
                                        <img
                                            src={stream.thumbnail}
                                            alt={stream.title}
                                            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform"
                                        />
                                        {stream.isLive && (
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <Badge className="bg-red-600 hover:bg-red-600 text-white">
                                                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                                    LIVE
                                                </Badge>
                                                {stream.isAI && (
                                                    <Badge
                                                        className="text-white font-semibold"
                                                        style={{
                                                            background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                                                        }}
                                                    >
                                                        ✨ AI
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                        <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {stream.viewers.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3
                                            className="font-semibold mb-2 line-clamp-2 transition-colors"
                                            style={{
                                                color: currentColors.text,
                                            }}
                                        >
                                            {stream.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 mb-2">{stream.streamer}</p>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                            style={{
                                                backgroundColor: currentColors.primary + "20",
                                                color: currentColors.accent,
                                            }}
                                        >
                                            {stream.category}
                                        </Badge>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-400">No streams found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
