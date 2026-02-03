"use client";

import { useTheme, themes } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Video, Eye, Sparkles, Zap, Brain, MessageSquare } from "lucide-react";

export default function Home() {
  const { currentColors } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1
            className="text-6xl md:text-7xl font-bold mb-6"
            style={{
              background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            The Future of Live Streaming
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Experience AI-powered live streaming with semantic search, intelligent chat, and real-time video analysis.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/create">
              <Button
                size="lg"
                className="text-lg px-8 hover:opacity-90"
                style={{
                  background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                }}
              >
                <Video className="mr-2 h-5 w-5" />
                Start Streaming
              </Button>
            </Link>
            <Link href="/watch">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8">
                <Eye className="mr-2 h-5 w-5" />
                Explore Streams
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-6 hover:border-slate-600 transition-all">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{
                background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
              }}
            >
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI-Powered Analysis</h3>
            <p className="text-slate-400">
              Our AI watches every frame, understanding context and enabling semantic search across your entire stream.
            </p>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-6 hover:border-slate-600 transition-all">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{
                background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
              }}
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Chat with Video</h3>
            <p className="text-slate-400">
              Ask questions about what's happening in the stream and get instant answers with timestamp references.
            </p>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-6 hover:border-slate-600 transition-all">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{
                background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
              }}
            >
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time Processing</h3>
            <p className="text-slate-400">
              WebRTC streaming with frame extraction, vector embeddings, and instant semantic search - all in real-time.
            </p>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Powered by Cutting-Edge Tech</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["WebRTC", "Go", "Python", "Next.js", "ChromaDB", "Redis", "AI/ML"].map((tech) => (
              <div
                key={tech}
                className="px-6 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg text-slate-300 hover:border-slate-600 transition-all"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {!isAuthenticated && (
          <div className="mt-20 text-center">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-12 max-w-2xl mx-auto">
              <Sparkles className="w-16 h-16 mx-auto mb-6" style={{ color: currentColors.accent }} />
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-slate-400 mb-6">
                Join Iris today and experience the future of live streaming.
              </p>
              <Link href="/auth">
                <Button
                  size="lg"
                  className="text-lg px-8 hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                  }}
                >
                  Sign Up Now
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
