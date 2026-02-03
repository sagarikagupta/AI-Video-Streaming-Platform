"use client";

import { useEffect, useRef, useState } from "react";

interface AIStreamGeneratorProps {
    streamType: "coding" | "ai-workshop" | "design" | "data" | "gaming" | "music" | "art" | "fitness";
    isPlaying: boolean;
}

export default function AIStreamGenerator({ streamType, isPlaying }: AIStreamGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [frameCount, setFrameCount] = useState(0);
    const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 500) + 100);
    const [chatMessages, setChatMessages] = useState<Array<{ user: string, message: string }>>([]);

    // Simulate viewer count changes
    useEffect(() => {
        const interval = setInterval(() => {
            setViewerCount(prev => Math.max(50, prev + Math.floor(Math.random() * 20) - 10));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Simulate chat messages
    useEffect(() => {
        const messages = [
            { user: "TechGuru42", message: "This is amazing!" },
            { user: "CodeMaster", message: "Great explanation 🔥" },
            { user: "AIEnthusiast", message: "Can you explain that again?" },
            { user: "StreamFan", message: "Love this stream!" },
            { user: "DevLife", message: "Following along!" },
            { user: "DataNerd", message: "Mind blown 🤯" },
        ];

        const interval = setInterval(() => {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            setChatMessages(prev => [...prev.slice(-4), randomMsg]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let lastTime = 0;

        const renderFrame = (timestamp: number) => {
            if (!isPlaying) {
                animationId = requestAnimationFrame(renderFrame);
                return;
            }

            const deltaTime = timestamp - lastTime;
            if (deltaTime < 1000 / 30) { // 30 FPS
                animationId = requestAnimationFrame(renderFrame);
                return;
            }
            lastTime = timestamp;

            // Clear canvas
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            switch (streamType) {
                case "coding":
                    renderCodingStream(ctx, canvas, frameCount);
                    break;
                case "ai-workshop":
                    renderAIWorkshop(ctx, canvas, frameCount);
                    break;
                case "design":
                    renderDesignStream(ctx, canvas, frameCount);
                    break;
                case "data":
                    renderDataStream(ctx, canvas, frameCount);
                    break;
                case "gaming":
                    renderGamingStream(ctx, canvas, frameCount);
                    break;
                case "music":
                    renderMusicStream(ctx, canvas, frameCount);
                    break;
                case "art":
                    renderArtStream(ctx, canvas, frameCount);
                    break;
                case "fitness":
                    renderFitnessStream(ctx, canvas, frameCount);
                    break;
            }

            // Render interactive overlays
            renderChatOverlay(ctx, canvas, chatMessages);
            renderViewerCount(ctx, canvas, viewerCount);

            setFrameCount((prev) => prev + 1);
            animationId = requestAnimationFrame(renderFrame);
        };

        animationId = requestAnimationFrame(renderFrame);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [streamType, isPlaying, frameCount, chatMessages, viewerCount]);

    return (
        <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            style={{ backgroundColor: "#000" }}
        />
    );
}

// Chat overlay
function renderChatOverlay(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, messages: Array<{ user: string, message: string }>) {
    const chatWidth = 400;
    const chatHeight = 300;
    const x = canvas.width - chatWidth - 20;
    const y = canvas.height - chatHeight - 20;

    // Chat background
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(x, y, chatWidth, chatHeight);

    // Chat messages
    ctx.font = "18px Arial";
    messages.forEach((msg, index) => {
        const msgY = y + 40 + index * 60;

        // Username
        ctx.fillStyle = "#60a5fa";
        ctx.fillText(msg.user, x + 15, msgY);

        // Message
        ctx.fillStyle = "#ffffff";
        ctx.fillText(msg.message, x + 15, msgY + 25);
    });

    // Chat title
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(x, y, chatWidth, 35);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.fillText("💬 Live Chat", x + 15, y + 25);
}

// Viewer count overlay
function renderViewerCount(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, count: number) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(20, 100, 180, 50);

    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 24px Arial";
    ctx.fillText(`👁️ ${count.toLocaleString()}`, 35, 135);
}

// Gaming stream
function renderGamingStream(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    // Game background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Player character (animated)
    const playerX = 300 + Math.sin(frame * 0.05) * 50;
    const playerY = canvas.height - 400;

    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(playerX, playerY, 80, 120);

    // Player head
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(playerX + 40, playerY - 30, 40, 0, Math.PI * 2);
    ctx.fill();

    // Obstacles
    for (let i = 0; i < 5; i++) {
        const obstacleX = (canvas.width / 6) * (i + 1) + Math.sin(frame * 0.03 + i) * 30;
        const obstacleY = canvas.height - 300;

        ctx.fillStyle = "#ef4444";
        ctx.fillRect(obstacleX, obstacleY, 60, 60);
    }

    // Score
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(canvas.width - 250, 20, 230, 70);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 36px Arial";
    ctx.fillText(`Score: ${frame * 10}`, canvas.width - 230, 65);

    // Title
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: Retro Platformer Speedrun", 50, 55);
}

// Music/DJ stream
function renderMusicStream(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    // Dark background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Audio visualizer bars
    const bars = 64;
    const barWidth = canvas.width / bars;

    for (let i = 0; i < bars; i++) {
        const height = Math.abs(Math.sin(frame * 0.1 + i * 0.2)) * (canvas.height * 0.6);
        const x = i * barWidth;
        const y = canvas.height / 2 - height / 2;

        const hue = (frame + i * 5) % 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fillRect(x, y, barWidth - 2, height);
    }

    // Circular visualizer
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;

    for (let i = 0; i < 360; i += 10) {
        const angle = (i + frame * 2) * Math.PI / 180;
        const length = 100 + Math.abs(Math.sin(frame * 0.05 + i * 0.1)) * 150;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + length);
        const y2 = centerY + Math.sin(angle) * (radius + length);

        ctx.strokeStyle = `hsl(${(frame + i) % 360}, 80%, 60%)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Title
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: Electronic Music Mix - Deep House", 50, 55);

    // BPM counter
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(50, canvas.height - 100, 200, 60);
    ctx.fillStyle = "#00ff00";
    ctx.font = "bold 32px monospace";
    ctx.fillText(`BPM: ${120 + Math.floor(Math.sin(frame * 0.1) * 10)}`, 70, canvas.height - 60);
}

// Art/Drawing stream
function renderArtStream(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    // Canvas background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Drawing area
    const drawX = 200;
    const drawY = 150;
    const drawWidth = canvas.width - 400;
    const drawHeight = canvas.height - 300;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(drawX, drawY, drawWidth, drawHeight);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);

    // Progressive drawing (flower)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const petals = 8;
    const maxPetals = Math.min(Math.floor(frame / 30), petals);

    for (let i = 0; i < maxPetals; i++) {
        const angle = (i * Math.PI * 2) / petals;
        const petalX = centerX + Math.cos(angle) * 150;
        const petalY = centerY + Math.sin(angle) * 150;

        ctx.fillStyle = `hsl(${i * 45}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(petalX, petalY, 80, 0, Math.PI * 2);
        ctx.fill();
    }

    // Center circle
    if (maxPetals >= petals) {
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
        ctx.fill();
    }

    // Brush cursor
    const cursorX = centerX + Math.cos(frame * 0.05) * 200;
    const cursorY = centerY + Math.sin(frame * 0.05) * 200;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, 15, 0, Math.PI * 2);
    ctx.stroke();

    // Title
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: Digital Art - Flower Illustration", 50, 55);

    // Color palette
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];
    colors.forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.fillRect(50 + index * 70, canvas.height - 100, 60, 60);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(50 + index * 70, canvas.height - 100, 60, 60);
    });
}

// Fitness stream
function renderFitnessStream(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#1e3a8a");
    gradient.addColorStop(1, "#312e81");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stick figure doing jumping jacks
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const jumpHeight = Math.abs(Math.sin(frame * 0.1)) * 50;

    // Head
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 200 - jumpHeight, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 150 - jumpHeight);
    ctx.lineTo(centerX, centerY + 50 - jumpHeight);
    ctx.stroke();

    // Arms (animated)
    const armAngle = Math.sin(frame * 0.1) * 0.8;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 100 - jumpHeight);
    ctx.lineTo(centerX - 100 * Math.cos(armAngle), centerY - 100 - jumpHeight - 100 * Math.sin(armAngle));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 100 - jumpHeight);
    ctx.lineTo(centerX + 100 * Math.cos(armAngle), centerY - 100 - jumpHeight - 100 * Math.sin(armAngle));
    ctx.stroke();

    // Legs (animated)
    const legAngle = Math.sin(frame * 0.1) * 0.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 50 - jumpHeight);
    ctx.lineTo(centerX - 80 * Math.sin(legAngle), centerY + 200 - jumpHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 50 - jumpHeight);
    ctx.lineTo(centerX + 80 * Math.sin(legAngle), centerY + 200 - jumpHeight);
    ctx.stroke();

    // Title
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: 30-Minute HIIT Workout", 50, 55);

    // Stats panel
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(50, 120, 300, 200);

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.fillText("⏱️ Time: " + Math.floor(frame / 30) + "s", 70, 160);
    ctx.fillText("🔥 Calories: " + Math.floor(frame / 10), 70, 200);
    ctx.fillText("💓 Heart Rate: " + (120 + Math.floor(Math.sin(frame * 0.1) * 20)), 70, 240);
    ctx.fillText("🏃 Reps: " + Math.floor(frame / 20), 70, 280);
}

// Existing stream renderers (coding, ai-workshop, design, data)
function renderCodingStream(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    const codeLines = [
        "import React, { useState, useEffect } from 'react';",
        "",
        "export default function StreamPlayer() {",
        "  const [isConnected, setIsConnected] = useState(false);",
        "  const [stream, setStream] = useState<MediaStream | null>(null);",
        "",
        "  useEffect(() => {",
        "    const initializeWebRTC = async () => {",
        "      const mediaStream = await navigator.mediaDevices.getUserMedia({",
        "        video: true,",
        "        audio: true",
        "      });",
        "      setStream(mediaStream);",
        "    };",
        "",
        "    initializeWebRTC();",
        "  }, []);",
        "",
        "  return (",
        "    <div className='stream-container'>",
        "      <video autoPlay playsInline />",
        "    </div>",
        "  );",
        "}",
    ];

    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

    ctx.fillStyle = "#252526";
    ctx.fillRect(50, 50, 80, canvas.height - 100);

    ctx.font = "24px 'Courier New', monospace";
    const visibleLines = Math.min(Math.floor(frame / 10), codeLines.length);

    codeLines.slice(0, visibleLines).forEach((line, index) => {
        ctx.fillStyle = "#858585";
        ctx.fillText((index + 1).toString().padStart(2, " "), 60, 100 + index * 35);

        ctx.fillStyle = getCodeColor(line);
        ctx.fillText(line, 150, 100 + index * 35);
    });

    if (frame % 30 < 15 && visibleLines < codeLines.length) {
        const cursorY = 100 + visibleLines * 35;
        const cursorX = 150 + ctx.measureText(codeLines[visibleLines] || "").width;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cursorX, cursorY - 20, 3, 25);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Arial";
    ctx.fillText("🔴 LIVE: Building a WebRTC Streaming App", 50, 50);
}

function renderAIWorkshop(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const layers = [4, 6, 6, 3];
    const layerSpacing = canvas.width / (layers.length + 1);
    const nodeRadius = 20;

    layers.forEach((nodeCount, layerIndex) => {
        const x = layerSpacing * (layerIndex + 1);
        const nodeSpacing = canvas.height / (nodeCount + 1);

        for (let i = 0; i < nodeCount; i++) {
            const y = nodeSpacing * (i + 1);

            if (layerIndex < layers.length - 1) {
                const nextLayerX = layerSpacing * (layerIndex + 2);
                const nextNodeCount = layers[layerIndex + 1];
                const nextNodeSpacing = canvas.height / (nextNodeCount + 1);

                for (let j = 0; j < nextNodeCount; j++) {
                    const nextY = nextNodeSpacing * (j + 1);
                    const activation = Math.sin(frame * 0.05 + i + j) * 0.5 + 0.5;

                    ctx.strokeStyle = `rgba(100, 200, 255, ${activation * 0.5})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(nextLayerX, nextY);
                    ctx.stroke();
                }
            }

            const activation = Math.sin(frame * 0.05 + i) * 0.5 + 0.5;
            ctx.fillStyle = `rgb(${100 + activation * 155}, ${100 + activation * 155}, 255)`;
            ctx.beginPath();
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: Deep Learning - Neural Networks Explained", 50, 60);

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(50, canvas.height - 150, 400, 100);
    ctx.fillStyle = "#00ff00";
    ctx.font = "24px monospace";
    ctx.fillText(`Epoch: ${Math.floor(frame / 30)}`, 70, canvas.height - 110);
    ctx.fillText(`Accuracy: ${(85 + Math.sin(frame * 0.1) * 10).toFixed(2)}%`, 70, canvas.height - 70);
}

function renderDesignStream(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 6) * (i + 1);
        const y = canvas.height / 2 + Math.sin(frame * 0.05 + i) * 100;
        const size = 150 + Math.cos(frame * 0.03 + i) * 50;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(frame * 0.02 + i);

        ctx.fillStyle = `hsla(${(frame + i * 60) % 360}, 70%, 60%, 0.8)`;
        ctx.fillRect(-size / 2, -size / 2, size, size);

        ctx.restore();
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: UI/UX Design - Modern Web Interfaces", 50, 60);
}

function renderDataStream(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bars = 12;
    const barWidth = (canvas.width - 200) / bars;
    const maxHeight = canvas.height - 300;

    for (let i = 0; i < bars; i++) {
        const height = Math.abs(Math.sin(frame * 0.05 + i * 0.5)) * maxHeight;
        const x = 100 + i * barWidth;
        const y = canvas.height - 150 - height;

        const gradient = ctx.createLinearGradient(x, y, x, canvas.height - 150);
        gradient.addColorStop(0, "#3b82f6");
        gradient.addColorStop(1, "#1e40af");
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 10, height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText(Math.floor(height).toString(), x + 10, y - 10);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: Data Science - Real-time Analytics", 50, 60);
}

function getCodeColor(line: string): string {
    if (line.includes("import") || line.includes("export") || line.includes("return")) {
        return "#c586c0";
    }
    if (line.includes("function") || line.includes("const") || line.includes("let")) {
        return "#569cd6";
    }
    if (line.includes("'") || line.includes('"')) {
        return "#ce9178";
    }
    if (line.includes("//")) {
        return "#6a9955";
    }
    return "#d4d4d4";
}
