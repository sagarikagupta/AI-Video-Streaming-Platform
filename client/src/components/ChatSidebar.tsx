"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Clock } from "lucide-react";

interface Message {
    id: string;
    type: "user" | "assistant";
    content: string;
    timestamps?: number[];
    context?: Array<{
        description: string;
        timestamp: number;
        datetime: string;
    }>;
}

interface ChatSidebarProps {
    onSeekToTimestamp?: (timestamp: number) => void;
}

export default function ChatSidebar({ onSeekToTimestamp }: ChatSidebarProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            type: "assistant",
            content: "👋 Hi! I'm watching the video with you. Ask me anything about what's happening!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Call the AI backend
            const response = await fetch("http://localhost:8000/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: input }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: "assistant",
                content: data.answer,
                timestamps: data.timestamps || [],
                context: data.context || [],
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error asking question:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: "assistant",
                content: "Sorry, I couldn't process that question. Make sure the AI server is running on port 8000.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <Card className="h-full flex flex-col bg-slate-900/50 backdrop-blur-xl border-slate-700">
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Chat with Video</h2>
                <p className="text-xs text-slate-400 mt-1">
                    Ask questions about what's happening
                </p>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[85%] rounded-lg p-3 ${message.type === "user"
                                        ? "bg-purple-600 text-white"
                                        : "bg-slate-800 text-slate-100"
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                                {/* Timestamps */}
                                {message.timestamps && message.timestamps.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs text-slate-400">Relevant moments:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {message.timestamps.slice(0, 3).map((ts, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-purple-500 transition-colors"
                                                    onClick={() => onSeekToTimestamp?.(ts)}
                                                >
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {formatTimestamp(ts)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Context preview */}
                                {message.context && message.context.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-slate-700">
                                        <p className="text-xs text-slate-400 italic">
                                            "{message.context[0].description}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-800 rounded-lg p-3">
                                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about the video..."
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
