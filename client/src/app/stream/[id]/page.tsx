"use client";

import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import AIStreamGenerator from "@/components/AIStreamGenerator";

// Mock stream data with AI-generated types
const streamData: Record<string, any> = {
    "1": {
        title: "Retro Platformer Speedrun - World Record Attempt",
        streamer: "ProGamer",
        viewers: 3847,
        category: "Gaming",
        description: "Join me as I attempt to break the world record for this classic platformer! Watch as I navigate through challenging levels with pixel-perfect precision.",
        startedAt: "2024-02-02T18:00:00Z",
        streamType: "gaming",
        isAI: true,
    },
    "2": {
        title: "Electronic Music Mix - Deep House Vibes",
        streamer: "DJ_Pulse",
        viewers: 2156,
        category: "Music",
        description: "Chill deep house mix with mesmerizing visualizations. Perfect for studying, working, or just relaxing. Drop a follow if you enjoy the vibes!",
        startedAt: "2024-02-02T17:30:00Z",
        streamType: "music",
        isAI: true,
    },
    "3": {
        title: "Digital Art - Flower Illustration Tutorial",
        streamer: "ArtMaster",
        viewers: 1456,
        category: "Art",
        description: "Creating beautiful digital flower illustrations from scratch. Learn color theory, composition, and digital painting techniques.",
        startedAt: "2024-02-02T19:00:00Z",
        streamType: "art",
        isAI: true,
    },
    "4": {
        title: "30-Minute HIIT Workout - Full Body Burn",
        streamer: "FitCoach",
        viewers: 2945,
        category: "Fitness",
        description: "High-intensity interval training session targeting all major muscle groups. No equipment needed - just bring your energy!",
        startedAt: "2024-02-02T18:30:00Z",
        streamType: "fitness",
        isAI: true,
    },
    "5": {
        title: "Full Stack Development - Building a Real-Time App",
        streamer: "CodeMaster",
        viewers: 2278,
        category: "Programming",
        description: "Join me as we build a real-time collaborative application using WebRTC, React, and Go. We'll cover everything from setting up the backend to implementing live video streaming.",
        startedAt: "2024-02-02T19:15:00Z",
        streamType: "coding",
        isAI: true,
    },
    "6": {
        title: "AI/ML Workshop - Neural Networks Deep Dive",
        streamer: "AIExpert",
        viewers: 3421,
        category: "AI/ML",
        description: "Deep dive into neural networks, covering backpropagation, gradient descent, and implementing a CNN from scratch using PyTorch.",
        startedAt: "2024-02-02T17:45:00Z",
        streamType: "ai-workshop",
        isAI: true,
    },
};

export default function StreamViewPage() {
    const params = useParams();
    const router = useRouter();
    const { currentColors } = useTheme();
    const streamId = params.id as string;
    const stream = streamData[streamId];

    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!stream) {
            router.push("/watch");
        }
    }, [stream, router]);

    if (!stream) {
        return null;
    }

    const streamDuration = () => {
        const start = new Date(stream.startedAt);
        const now = new Date();
        const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
        return `${diff} minutes`;
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-4 text-slate-300 hover:text-white"
                    onClick={() => router.push("/watch")}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Streams
                </Button>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Video Player */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="overflow-hidden" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                            <div className="relative aspect-video bg-black">
                                {stream.isAI ? (
                                    <AIStreamGenerator streamType={stream.streamType} isPlaying={isPlaying} />
                                ) : (
                                    <video
                                        className="w-full h-full"
                                        controls
                                        autoPlay
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        poster={`https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop`}
                                    >
                                        <source src={stream.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-red-600 hover:bg-red-600 text-white">
                                        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                        LIVE {stream.isAI && "• AI GENERATED"}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-3 right-3 flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="bg-black/70 hover:bg-black/90"
                                    >
                                        {isPlaying ? "⏸ Pause" : "▶ Play"}
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Stream Info */}
                        <Card className="p-6" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-white mb-2">{stream.title}</h1>
                                    <p className="text-slate-400 mb-3">{stream.streamer}</p>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {stream.viewers.toLocaleString()} watching
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            Started {streamDuration()} ago
                                        </div>
                                    </div>
                                </div>
                                <Badge
                                    style={{
                                        backgroundColor: currentColors.primary + "20",
                                        color: currentColors.accent,
                                    }}
                                >
                                    {stream.category}
                                </Badge>
                            </div>

                            <div className="border-t border-slate-700 pt-4">
                                <h3 className="text-lg font-semibold text-white mb-2">About this stream</h3>
                                <p className="text-slate-300">{stream.description}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Streamer Card */}
                        <Card className="p-6" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                            <h3 className="text-lg font-semibold text-white mb-4">Streamer</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                    style={{
                                        background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                                    }}
                                >
                                    {stream.streamer.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{stream.streamer}</p>
                                    <p className="text-sm text-slate-400">Professional Developer</p>
                                </div>
                            </div>
                            <Button
                                className="w-full"
                                style={{
                                    background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                                }}
                            >
                                Follow
                            </Button>
                        </Card>

                        {/* Stream Stats */}
                        <Card className="p-6" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                            <h3 className="text-lg font-semibold text-white mb-4">Stream Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Peak Viewers</span>
                                    <span className="text-white font-semibold">{(stream.viewers + 234).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Average Viewers</span>
                                    <span className="text-white font-semibold">{(stream.viewers - 123).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Stream Quality</span>
                                    <span className="text-white font-semibold">1080p60</span>
                                </div>
                            </div>
                        </Card>

                        {/* Related Streams */}
                        <Card className="p-6" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                            <h3 className="text-lg font-semibold text-white mb-4">Related Streams</h3>
                            <div className="space-y-3">
                                {Object.entries(streamData)
                                    .filter(([id]) => id !== streamId)
                                    .slice(0, 3)
                                    .map(([id, relatedStream]) => (
                                        <div
                                            key={id}
                                            className="cursor-pointer hover:bg-slate-700/30 p-2 rounded-lg transition-colors"
                                            onClick={() => router.push(`/stream/${id}`)}
                                        >
                                            <p className="text-sm font-semibold text-white line-clamp-2 mb-1">
                                                {relatedStream.title}
                                            </p>
                                            <p className="text-xs text-slate-400">{relatedStream.streamer}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="bg-red-600 hover:bg-red-600 text-white text-xs">LIVE</Badge>
                                                <span className="text-xs text-slate-500">
                                                    {relatedStream.viewers.toLocaleString()} viewers
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
