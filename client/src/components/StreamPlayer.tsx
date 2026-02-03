import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Loader2, MessageSquare } from "lucide-react";
import ChatSidebar from "@/components/ChatSidebar";
import { useTheme, themes } from "@/contexts/ThemeContext";

const SIGNALING_SERVER = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080/signal";

export default function StreamPlayer() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [streamStartTime, setStreamStartTime] = useState<number | null>(null);

  const { currentColors } = useTheme();

  const startStream = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create WebSocket connection
      const ws = new WebSocket(SIGNALING_SERVER);
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        initializePeerConnection(stream, ws);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("Failed to connect to signaling server");
        setIsConnecting(false);
      };

      ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        await handleSignalingMessage(message);
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        stopStream();
      };
    } catch (err: any) {
      console.error("Error starting stream:", err);
      setError(err.message || "Failed to access camera/microphone");
      setIsConnecting(false);
    }
  };

  const initializePeerConnection = async (
    stream: MediaStream,
    ws: WebSocket
  ) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionRef.current = pc;

    // Add local tracks to peer connection
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Handle incoming tracks (echo from server)
    pc.ontrack = (event) => {
      console.log("📹 Received remote track");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      setIsStreaming(true);
      setIsConnecting(false);
      setStreamStartTime(Date.now());
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(
          JSON.stringify({
            type: "candidate",
            candidate: event.candidate.toJSON(),
          })
        );
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("🔗 ICE Connection State:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        setError("Connection failed. Please try again.");
        setIsConnecting(false);
      }
    };

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    ws.send(
      JSON.stringify({
        type: "offer",
        sdp: offer,
      })
    );

    console.log("📤 Sent offer to server");
  };

  const handleSignalingMessage = async (message: any) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    switch (message.type) {
      case "answer":
        console.log("📨 Received answer");
        await pc.setRemoteDescription(
          new RTCSessionDescription(message.sdp)
        );
        break;

      case "candidate":
        if (message.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
        break;
    }
  };

  const stopStream = () => {
    // Stop local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Close WebSocket
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setIsConnecting(false);
    setError(null);
    setStreamStartTime(null);
  };

  const handleSeekToTimestamp = (timestamp: number) => {
    // Note: For live streams, we can't actually seek
    // This would work with recorded video
    // For now, we'll just log it
    console.log(`🎯 Seeking to timestamp: ${timestamp}`);

    if (streamStartTime) {
      const elapsedSeconds = Math.floor((Date.now() - streamStartTime) / 1000);
      const targetSeconds = timestamp - Math.floor(streamStartTime / 1000);
      const difference = targetSeconds - elapsedSeconds;

      console.log(`Current position: ${elapsedSeconds}s, Target: ${targetSeconds}s, Difference: ${difference}s`);
    }

    // In a production app with recorded streams, you would:
    // if (remoteVideoRef.current) {
    //   remoteVideoRef.current.currentTime = targetTime;
    // }
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold mb-2"
            style={{
              background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Create Your Stream
          </h1>
          <p className="text-slate-400 text-lg">
            Start streaming with AI-powered analysis
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 shadow-2xl">
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Local Video (Your Camera) */}
                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10 bg-slate-900/80 px-3 py-1 rounded-full text-sm text-slate-300">
                      Your Camera
                    </div>
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full aspect-video bg-slate-950 rounded-lg shadow-lg"
                    />
                  </div>

                  {/* Remote Video (Echo from Server) */}
                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10 bg-purple-600/80 px-3 py-1 rounded-full text-sm text-white">
                      Server Echo
                    </div>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full aspect-video bg-slate-950 rounded-lg shadow-lg"
                    />
                    {!isStreaming && !isConnecting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 rounded-lg">
                        <VideoOff className="w-16 h-16 text-slate-600" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  {!isStreaming && !isConnecting && (
                    <Button
                      onClick={startStream}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                    >
                      <Video className="mr-2 h-5 w-5" />
                      Start Stream
                    </Button>
                  )}

                  {isConnecting && (
                    <Button
                      disabled
                      size="lg"
                      className="bg-slate-700 text-slate-300 px-8"
                    >
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connecting...
                    </Button>
                  )}

                  {isStreaming && (
                    <>
                      <Button
                        onClick={stopStream}
                        size="lg"
                        variant="destructive"
                        className="px-8"
                      >
                        <VideoOff className="mr-2 h-5 w-5" />
                        Stop Stream
                      </Button>
                      <Button
                        onClick={() => setShowChat(!showChat)}
                        size="lg"
                        variant="outline"
                        className="px-8 border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <MessageSquare className="mr-2 h-5 w-5" />
                        {showChat ? "Hide" : "Show"} Chat
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <div className="p-4 bg-slate-800/30 backdrop-blur-xl border border-slate-700 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">
                🎬 Full System Demo
              </h3>
              <p className="text-xs text-slate-500">
                WebRTC streaming + Frame extraction + AI analysis + Semantic search.
                Start streaming and use the chat to ask questions about the video!
              </p>
            </div>
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="lg:col-span-1">
              <div className="sticky top-6 h-[calc(100vh-3rem)]">
                <ChatSidebar onSeekToTimestamp={handleSeekToTimestamp} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
