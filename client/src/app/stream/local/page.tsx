"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Video, VideoOff, Users } from "lucide-react";
import QRCode from "qrcode";

export default function LocalStreamPage() {
    const { currentColors } = useTheme();
    const [mode, setMode] = useState<"broadcaster" | "viewer" | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
    const [offerCode, setOfferCode] = useState("");
    const [answerCode, setAnswerCode] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [copied, setCopied] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const iceServers = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
        ],
    };

    // Attach video stream when it's available
    useEffect(() => {
        if (localStreamRef.current && localVideoRef.current && mode === "broadcaster") {
            localVideoRef.current.srcObject = localStreamRef.current;
            localVideoRef.current.play().catch(e => console.log("Play error:", e));
        }
    }, [mode, localStreamRef.current]);

    // Start broadcasting
    const startBroadcast = async () => {
        try {
            setConnectionStatus("connecting");

            // Set mode first so UI updates
            setMode("broadcaster");

            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            localStreamRef.current = stream;

            // Create peer connection
            const pc = new RTCPeerConnection(iceServers);
            peerConnectionRef.current = pc;

            // Add tracks to peer connection
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            // Collect ICE candidates
            const candidates: RTCIceCandidate[] = [];
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    candidates.push(event.candidate);
                }
            };

            // Create offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Wait for ICE gathering to complete
            await new Promise<void>((resolve) => {
                if (pc.iceGatheringState === "complete") {
                    resolve();
                } else {
                    pc.onicegatheringstatechange = () => {
                        if (pc.iceGatheringState === "complete") {
                            resolve();
                        }
                    };
                }
            });

            // Create offer code with ICE candidates
            const offerData = {
                sdp: pc.localDescription,
                candidates: candidates,
            };
            const code = btoa(JSON.stringify(offerData));
            setOfferCode(code);

            // Generate QR code
            const qrUrl = await QRCode.toDataURL(code, {
                width: 300,
                margin: 2,
            });
            setQrCodeUrl(qrUrl);

            setIsStreaming(true);
        } catch (error) {
            console.error("Error starting broadcast:", error);
            setConnectionStatus("disconnected");
            setMode(null);
            alert("Failed to start broadcast. Please allow camera/microphone access.");
        }
    };

    // Handle answer from viewer
    const handleAnswer = async (answerCodeInput: string) => {
        try {
            const pc = peerConnectionRef.current;
            if (!pc) return;

            const answerData = JSON.parse(atob(answerCodeInput));

            // Set remote description
            await pc.setRemoteDescription(new RTCSessionDescription(answerData.sdp));

            // Add ICE candidates
            for (const candidate of answerData.candidates) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }

            setConnectionStatus("connected");
        } catch (error) {
            console.error("Error handling answer:", error);
            alert("Invalid answer code. Please try again.");
        }
    };

    // Join as viewer
    const joinStream = async (offerCodeInput: string) => {
        try {
            setConnectionStatus("connecting");
            setMode("viewer");

            const offerData = JSON.parse(atob(offerCodeInput));

            // Create peer connection
            const pc = new RTCPeerConnection(iceServers);
            peerConnectionRef.current = pc;

            // Handle incoming tracks
            pc.ontrack = (event) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
                setConnectionStatus("connected");
            };

            // Set remote description
            await pc.setRemoteDescription(new RTCSessionDescription(offerData.sdp));

            // Add ICE candidates from offer
            for (const candidate of offerData.candidates) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }

            // Collect ICE candidates
            const candidates: RTCIceCandidate[] = [];
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    candidates.push(event.candidate);
                }
            };

            // Create answer
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            // Wait for ICE gathering
            await new Promise<void>((resolve) => {
                if (pc.iceGatheringState === "complete") {
                    resolve();
                } else {
                    pc.onicegatheringstatechange = () => {
                        if (pc.iceGatheringState === "complete") {
                            resolve();
                        }
                    };
                }
            });

            // Create answer code
            const answerData = {
                sdp: pc.localDescription,
                candidates: candidates,
            };
            const code = btoa(JSON.stringify(answerData));
            setAnswerCode(code);

            // Generate QR code for answer
            const qrUrl = await QRCode.toDataURL(code, {
                width: 300,
                margin: 2,
            });
            setQrCodeUrl(qrUrl);

        } catch (error) {
            console.error("Error joining stream:", error);
            setConnectionStatus("disconnected");
            alert("Failed to join stream. Please check the offer code.");
        }
    };

    // Stop streaming
    const stopStream = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        setIsStreaming(false);
        setConnectionStatus("disconnected");
        setMode(null);
        setOfferCode("");
        setAnswerCode("");
        setQrCodeUrl("");
    };

    // Copy to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Local P2P Streaming</h1>
                    <p className="text-slate-400">
                        Stream directly to friends on the same WiFi network - no backend needed!
                    </p>
                </div>

                {!mode ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Broadcaster Card */}
                        <Card
                            className="p-8 cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: currentColors.card, borderColor: currentColors.primary }}
                        >
                            <div className="text-center">
                                <div
                                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                                    }}
                                >
                                    <Video className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Start Broadcasting</h2>
                                <p className="text-slate-400 mb-6">
                                    Share your camera with others using a QR code or text code
                                </p>
                                <Button
                                    className="w-full"
                                    style={{
                                        background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                                    }}
                                    onClick={startBroadcast}
                                >
                                    <Video className="w-4 h-4 mr-2" />
                                    Go Live Locally
                                </Button>
                            </div>
                        </Card>

                        {/* Viewer Card */}
                        <Card
                            className="p-8"
                            style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}
                        >
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                                    <Users className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Join a Stream</h2>
                                <p className="text-slate-400 mb-6">
                                    Watch someone's stream by scanning their QR code or pasting their code
                                </p>
                                <input
                                    type="text"
                                    placeholder="Paste offer code here..."
                                    className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white mb-4"
                                    onChange={(e) => setOfferCode(e.target.value)}
                                />
                                <Button
                                    className="w-full bg-slate-700 hover:bg-slate-600"
                                    onClick={() => joinStream(offerCode)}
                                    disabled={!offerCode}
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Join Stream
                                </Button>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Connection Status */}
                        <Card className="p-4" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Badge
                                        className={
                                            connectionStatus === "connected"
                                                ? "bg-green-600"
                                                : connectionStatus === "connecting"
                                                    ? "bg-yellow-600"
                                                    : "bg-red-600"
                                        }
                                    >
                                        {connectionStatus === "connected" && "🟢 Connected"}
                                        {connectionStatus === "connecting" && "🟡 Connecting..."}
                                        {connectionStatus === "disconnected" && "🔴 Disconnected"}
                                    </Badge>
                                    <span className="text-white font-semibold">
                                        {mode === "broadcaster" ? "Broadcasting" : "Viewing"}
                                    </span>
                                </div>
                                <Button variant="destructive" onClick={stopStream}>
                                    <VideoOff className="w-4 h-4 mr-2" />
                                    Stop
                                </Button>
                            </div>
                        </Card>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Video Display */}
                            <div className="lg:col-span-2">
                                <Card className="overflow-hidden" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                                    <div className="relative aspect-video bg-black">
                                        {mode === "broadcaster" ? (
                                            <video
                                                ref={localVideoRef}
                                                autoPlay
                                                muted
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                ref={remoteVideoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-red-600">
                                                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                                {mode === "broadcaster" ? "BROADCASTING" : "WATCHING"}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Connection Info */}
                            <div className="space-y-4">
                                <Card className="p-6" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        {mode === "broadcaster" ? "Share This Code" : "Send This Code Back"}
                                    </h3>

                                    {/* QR Code */}
                                    {qrCodeUrl && (
                                        <div className="mb-4">
                                            <img src={qrCodeUrl} alt="QR Code" className="w-full rounded-lg" />
                                            <p className="text-xs text-slate-400 text-center mt-2">
                                                Scan with phone camera
                                            </p>
                                        </div>
                                    )}

                                    {/* Text Code */}
                                    <div className="bg-slate-800 p-3 rounded-lg mb-3">
                                        <p className="text-xs text-slate-300 break-all font-mono">
                                            {mode === "broadcaster" ? offerCode : answerCode}
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={() => copyToClipboard(mode === "broadcaster" ? offerCode : answerCode)}
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? "Copied!" : "Copy Code"}
                                    </Button>
                                </Card>

                                {mode === "broadcaster" && !connectionStatus.includes("connected") && (
                                    <Card className="p-6" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                                        <h3 className="text-lg font-semibold text-white mb-4">Waiting for Viewer</h3>
                                        <p className="text-sm text-slate-400 mb-4">
                                            Once a viewer joins, they'll send you an answer code. Paste it here:
                                        </p>
                                        <input
                                            type="text"
                                            placeholder="Paste answer code..."
                                            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white mb-3"
                                            onChange={(e) => setAnswerCode(e.target.value)}
                                        />
                                        <Button
                                            className="w-full"
                                            onClick={() => handleAnswer(answerCode)}
                                            disabled={!answerCode}
                                            style={{
                                                background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                                            }}
                                        >
                                            Connect
                                        </Button>
                                    </Card>
                                )}

                                <Card className="p-6" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                                    <h3 className="text-lg font-semibold text-white mb-2">How It Works</h3>
                                    <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
                                        <li>Broadcaster shares QR/text code</li>
                                        <li>Viewer scans/pastes code to join</li>
                                        <li>Viewer sends answer code back</li>
                                        <li>Direct P2P connection established!</li>
                                    </ol>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Section */}
                {!mode && (
                    <Card className="mt-6 p-6" style={{ backgroundColor: currentColors.card, borderColor: "#475569" }}>
                        <h3 className="text-xl font-semibold text-white mb-4">About Local P2P Streaming</h3>
                        <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <h4 className="font-semibold text-white mb-2">✅ No Backend Required</h4>
                                <p className="text-slate-400">
                                    Direct peer-to-peer connection using WebRTC. No server costs!
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">📱 QR Code Sharing</h4>
                                <p className="text-slate-400">
                                    Scan with your phone camera to instantly join streams.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">🏠 Local Network</h4>
                                <p className="text-slate-400">
                                    Works best on same WiFi. Perfect for demos and testing!
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
