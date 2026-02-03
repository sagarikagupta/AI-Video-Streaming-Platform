export interface StreamHistory {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    viewCount: number;
    date: string;
    streamer?: string;
}

export const mockWatchHistory: StreamHistory[] = [
    {
        id: "1",
        title: "Building a RAG System with ChromaDB",
        thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop",
        duration: "2:34:15",
        viewCount: 1234,
        date: "2026-02-01",
        streamer: "CodeMaster",
    },
    {
        id: "2",
        title: "WebRTC Live Streaming Tutorial",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
        duration: "1:45:30",
        viewCount: 856,
        date: "2026-01-30",
        streamer: "TechGuru",
    },
    {
        id: "3",
        title: "AI Agent Development Workshop",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
        duration: "3:12:45",
        viewCount: 2341,
        date: "2026-01-28",
        streamer: "AIExpert",
    },
];

export const mockCreateHistory: StreamHistory[] = [
    {
        id: "c1",
        title: "My First Live Stream - Testing Iris",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop",
        duration: "0:45:20",
        viewCount: 45,
        date: "2026-02-02",
    },
    {
        id: "c2",
        title: "Coding Session: Next.js App",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
        duration: "2:15:10",
        viewCount: 123,
        date: "2026-01-31",
    },
];
