import asyncio
import json
import logging
import os
from datetime import datetime
from typing import List, Dict, Optional

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Iris AI Engine")

# Initialize embedding model (local, no API key needed)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize ChromaDB (local vector database)
chroma_client = chromadb.Client(Settings(
    persist_directory="./chroma_db",
    anonymized_telemetry=False
))

# Get or create collection for video frames
try:
    collection = chroma_client.get_or_create_collection(
        name="video_frames",
        metadata={"description": "Video frame descriptions with timestamps"}
    )
    logger.info("✅ ChromaDB collection initialized")
except Exception as e:
    logger.error(f"❌ Failed to initialize ChromaDB: {e}")
    collection = None

# Redis connection
redis_client = None


class QuestionRequest(BaseModel):
    question: str


class AnswerResponse(BaseModel):
    question: str
    answer: str
    timestamps: List[int]
    context: List[Dict[str, any]]


@app.on_event("startup")
async def startup_event():
    """Initialize Redis connection on startup"""
    global redis_client
    try:
        redis_client = await redis.from_url("redis://localhost:6379")
        logger.info("✅ Connected to Redis")
        
        # Start frame consumer in background
        asyncio.create_task(consume_frames())
    except Exception as e:
        logger.error(f"❌ Failed to connect to Redis: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Close Redis connection on shutdown"""
    if redis_client:
        await redis_client.close()


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "iris-ai",
        "vector_db": "connected" if collection else "disconnected"
    }


async def consume_frames():
    """
    Background task that listens to Redis Pub/Sub for video frames
    and processes them with the Vision Model
    """
    if not redis_client:
        logger.error("Redis client not initialized")
        return

    pubsub = redis_client.pubsub()
    await pubsub.subscribe("video-frames")
    
    logger.info("👁️  Frame consumer started, listening to 'video-frames' channel")

    async for message in pubsub.listen():
        if message["type"] == "message":
            try:
                frame_data = json.loads(message["data"])
                timestamp = frame_data.get("timestamp")
                frame_base64 = frame_data.get("frameData")

                logger.info(f"📸 Received frame at timestamp: {timestamp}")

                # Analyze frame (placeholder for now)
                description = await analyze_frame(frame_base64, timestamp)
                
                if description and collection:
                    # Generate embedding and store in vector DB
                    await store_frame_description(description, timestamp)
                    logger.info(f"🧠 Frame stored: {description}")

            except Exception as e:
                logger.error(f"Error processing frame: {e}")


async def analyze_frame(frame_base64: str, timestamp: int) -> str:
    """
    Analyze a video frame using Vision Model
    
    Args:
        frame_base64: Base64 encoded JPEG image
        timestamp: Unix timestamp of the frame
        
    Returns:
        Text description of the frame
    """
    # Placeholder for MVP - simulating frame analysis
    # In production, you would call GPT-4o Vision or LLaVA here
    
    # Simulate different descriptions based on timestamp
    descriptions = [
        "Person coding on a laptop with multiple terminal windows open",
        "Screen showing a React component with TypeScript code",
        "Terminal displaying git commit messages and logs",
        "Browser window with localhost development server running",
        "Code editor with Python FastAPI application",
        "Database schema diagram on whiteboard",
        "Video conference call with team members discussing architecture"
    ]
    
    # Use timestamp to vary descriptions
    idx = (timestamp // 5) % len(descriptions)
    return descriptions[idx]


async def store_frame_description(description: str, timestamp: int):
    """
    Store frame description in vector database with embedding
    
    Args:
        description: Text description of the frame
        timestamp: Unix timestamp of the frame
    """
    if not collection:
        logger.warning("ChromaDB collection not available")
        return
    
    try:
        # Generate embedding
        embedding = embedding_model.encode(description).tolist()
        
        # Store in ChromaDB
        collection.add(
            embeddings=[embedding],
            documents=[description],
            metadatas=[{
                "timestamp": timestamp,
                "datetime": datetime.fromtimestamp(timestamp).isoformat()
            }],
            ids=[f"frame_{timestamp}"]
        )
        
        logger.info(f"💾 Stored frame embedding for timestamp {timestamp}")
    except Exception as e:
        logger.error(f"Failed to store frame: {e}")


@app.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    """
    Query the video context using semantic search (RAG)
    
    Args:
        request: Question request with user's question
        
    Returns:
        Answer with relevant timestamps and context
    """
    if not collection:
        raise HTTPException(status_code=503, detail="Vector database not available")
    
    try:
        # Generate embedding for the question
        question_embedding = embedding_model.encode(request.question).tolist()
        
        # Search vector DB for similar frame descriptions
        results = collection.query(
            query_embeddings=[question_embedding],
            n_results=5  # Get top 5 most relevant frames
        )
        
        # Extract context
        context = []
        timestamps = []
        
        if results['documents'] and len(results['documents'][0]) > 0:
            for i, doc in enumerate(results['documents'][0]):
                metadata = results['metadatas'][0][i]
                timestamp = metadata['timestamp']
                timestamps.append(timestamp)
                context.append({
                    "description": doc,
                    "timestamp": timestamp,
                    "datetime": metadata['datetime'],
                    "distance": results['distances'][0][i] if 'distances' in results else None
                })
        
        # Generate answer based on context
        if context:
            answer = generate_answer(request.question, context)
        else:
            answer = "I haven't seen anything related to that in the video yet."
        
        return AnswerResponse(
            question=request.question,
            answer=answer,
            timestamps=timestamps,
            context=context
        )
    
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def generate_answer(question: str, context: List[Dict]) -> str:
    """
    Generate an answer based on retrieved context
    
    Args:
        question: User's question
        context: Retrieved frame descriptions with timestamps
        
    Returns:
        Natural language answer
    """
    # Simple answer generation (in production, use LLM for better answers)
    if not context:
        return "I haven't captured any frames yet."
    
    # Format the most relevant frame
    top_frame = context[0]
    dt = datetime.fromisoformat(top_frame['datetime'])
    
    answer = f"At {dt.strftime('%H:%M:%S')}, I saw: {top_frame['description']}."
    
    if len(context) > 1:
        answer += f" I also found {len(context) - 1} other relevant moments in the video."
    
    return answer


@app.get("/stats")
async def get_stats():
    """Get statistics about stored frames"""
    if not collection:
        return {"error": "Vector database not available"}
    
    try:
        count = collection.count()
        return {
            "total_frames": count,
            "collection_name": collection.name
        }
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
