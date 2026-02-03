# Iris - Agentic Live-Streaming Engine

An intelligent video streaming platform that uses AI to watch and understand live WebRTC streams in real-time, enabling semantic search and chat-with-video capabilities.

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │◄───────►│  Server-Go   │◄───────►│  Server-AI  │
│  (Next.js)  │  WebRTC │  (Pion/Gin)  │  Redis  │  (FastAPI)  │
└─────────────┘         └──────────────┘         └─────────────┘
                              │                         │
                              │                         ▼
                              │                   ┌──────────┐
                              └──────────────────►│ Vector DB│
                                Frame Extract     └──────────┘
```

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI
- **Streaming Server**: Go, Pion WebRTC, Gin
- **AI Engine**: Python, FastAPI, OpenAI GPT-4o
- **Infrastructure**: Redis, Pinecone/ChromaDB

## 📦 Setup

### Prerequisites

- Node.js 18+
- Go 1.21+
- Python 3.12+
- Redis (see [redis_setup.md](redis_setup.md))

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:sagarikagupta/AI-Video-Streaming-Platform.git
   cd AI-Video-Streaming-Platform
   ```

2. **Install Client dependencies**:
   ```bash
   cd client
   npm install
   ```

3. **Install Go dependencies**:
   ```bash
   cd ../server-go
   go mod download
   ```

4. **Install Python dependencies**:
   ```bash
   cd ../server-ai
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

5. **Set up Redis** (see [redis_setup.md](redis_setup.md))

## 🎮 Usage

### Start all services:

**Terminal 1 - Redis**:
```bash
redis-server
```

**Terminal 2 - Go Server**:
```bash
cd server-go
go run main.go
# Running on :8080
```

**Terminal 3 - Python AI Worker**:
```bash
cd server-ai
python main.py
# Running on :8000
```

**Terminal 4 - Next.js Client**:
```bash
cd client
npm run dev
# Running on :3000
```

### Access the app:

Open http://localhost:3000 in your browser, click "Start Stream", and grant camera permissions.

## 🎯 Features

### Phase 1: ✅ WebRTC Loopback
- Live video streaming via WebRTC
- Low-latency peer connection
- Dual video display (local + server echo)

### Phase 2: ✅ Vision Pipeline
- Frame extraction (1 frame/5s)
- Redis Pub/Sub messaging
- AI worker with Vision Model integration (placeholder)

### Phase 3: 🚧 RAG & Indexing (Coming Soon)
- Vector database integration
- Embedding generation
- Semantic search endpoint

### Phase 4: 🚧 Chat Interface (Coming Soon)
- Chat sidebar UI
- Real-time Q&A with video context
- Timestamp-based navigation

## 📝 Project Structure

```
/iris
  /client          # Next.js frontend
  /server-go       # Go WebRTC server
  /server-ai       # Python AI engine
  /infra           # Docker configs
```

## 🔧 Development

- **Go Server**: Handles WebRTC signaling and frame extraction
- **Python AI**: Processes frames with Vision Models
- **Next.js Client**: User interface and WebRTC client

## 📄 License

MIT
