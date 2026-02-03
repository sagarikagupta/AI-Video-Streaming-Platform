"use client";

import { useEffect, useRef, useState } from "react";

interface AIStreamGeneratorProps {
    streamType: "coding" | "ai-workshop" | "design" | "data";
    isPlaying: boolean;
}

export default function AIStreamGenerator({ streamType, isPlaying }: AIStreamGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [frameCount, setFrameCount] = useState(0);

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
            }

            setFrameCount((prev) => prev + 1);
            animationId = requestAnimationFrame(renderFrame);
        };

        animationId = requestAnimationFrame(renderFrame);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [streamType, isPlaying, frameCount]);

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

// Coding stream with animated code
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

    // Dark IDE background
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Line numbers background
    ctx.fillStyle = "#252526";
    ctx.fillRect(50, 50, 80, canvas.height - 100);

    // Code rendering
    ctx.font = "24px 'Courier New', monospace";
    const visibleLines = Math.min(Math.floor(frame / 10), codeLines.length);

    codeLines.slice(0, visibleLines).forEach((line, index) => {
        // Line number
        ctx.fillStyle = "#858585";
        ctx.fillText((index + 1).toString().padStart(2, " "), 60, 100 + index * 35);

        // Code with syntax highlighting
        ctx.fillStyle = getCodeColor(line);
        ctx.fillText(line, 150, 100 + index * 35);
    });

    // Cursor blink
    if (frame % 30 < 15 && visibleLines < codeLines.length) {
        const cursorY = 100 + visibleLines * 35;
        const cursorX = 150 + ctx.measureText(codeLines[visibleLines] || "").width;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cursorX, cursorY - 20, 3, 25);
    }

    // Title overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Arial";
    ctx.fillText("🔴 LIVE: Building a WebRTC Streaming App", 50, 50);
}

// AI Workshop with neural network visualization
function renderAIWorkshop(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Neural network layers
    const layers = [4, 6, 6, 3];
    const layerSpacing = canvas.width / (layers.length + 1);
    const nodeRadius = 20;

    layers.forEach((nodeCount, layerIndex) => {
        const x = layerSpacing * (layerIndex + 1);
        const nodeSpacing = canvas.height / (nodeCount + 1);

        for (let i = 0; i < nodeCount; i++) {
            const y = nodeSpacing * (i + 1);

            // Draw connections to next layer
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

            // Draw node
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

    // Title
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: Deep Learning - Neural Networks Explained", 50, 60);

    // Stats overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(50, canvas.height - 150, 400, 100);
    ctx.fillStyle = "#00ff00";
    ctx.font = "24px monospace";
    ctx.fillText(`Epoch: ${Math.floor(frame / 30)}`, 70, canvas.height - 110);
    ctx.fillText(`Accuracy: ${(85 + Math.sin(frame * 0.1) * 10).toFixed(2)}%`, 70, canvas.height - 70);
}

// Design stream with animated shapes
function renderDesignStream(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated geometric shapes
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

    // Title
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: UI/UX Design - Modern Web Interfaces", 50, 60);
}

// Data visualization stream
function renderDataStream(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated bar chart
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

        // Value label
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText(Math.floor(height).toString(), x + 10, y - 10);
    }

    // Title
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("🔴 LIVE: Data Science - Real-time Analytics", 50, 60);
}

function getCodeColor(line: string): string {
    if (line.includes("import") || line.includes("export") || line.includes("return")) {
        return "#c586c0"; // Keywords
    }
    if (line.includes("function") || line.includes("const") || line.includes("let")) {
        return "#569cd6"; // Keywords
    }
    if (line.includes("'") || line.includes('"')) {
        return "#ce9178"; // Strings
    }
    if (line.includes("//")) {
        return "#6a9955"; // Comments
    }
    return "#d4d4d4"; // Default
}
