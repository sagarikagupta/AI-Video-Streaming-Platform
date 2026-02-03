package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v4"
	"github.com/redis/go-redis/v9"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all origins for development
		},
	}

	// Store active peer connections
	peerConnections = make(map[string]*webrtc.PeerConnection)
	peerMutex       sync.RWMutex

	// Redis client
	redisClient *redis.Client
	ctx         = context.Background()
)

type SignalMessage struct {
	Type      string                     `json:"type"`
	SDP       *webrtc.SessionDescription `json:"sdp,omitempty"`
	Candidate *webrtc.ICECandidateInit   `json:"candidate,omitempty"`
	ClientID  string                     `json:"clientId"`
}

type FrameMessage struct {
	Timestamp int64  `json:"timestamp"`
	FrameData string `json:"frameData"` // Base64 encoded JPEG
}

func main() {
	// Initialize Redis client
	redisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	// Test Redis connection
	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Printf("⚠️  Redis not available: %v (Frame extraction disabled)", err)
	} else {
		log.Println("✅ Redis connected")
	}

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.GET("/signal", handleSignaling)

	log.Println("🚀 Iris Server running on :8080")
	r.Run(":8080")
}

func handleSignaling(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	log.Println("✅ New WebSocket connection established")

	// Create a new WebRTC PeerConnection
	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}

	peerConnection, err := webrtc.NewPeerConnection(config)
	if err != nil {
		log.Println("Failed to create peer connection:", err)
		return
	}

	// Handle incoming tracks (video/audio from client)
	peerConnection.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		log.Printf("📹 Track received: %s (type: %s)", track.ID(), track.Kind())

		// Echo the track back to the sender (for loopback demo)
		localTrack, err := webrtc.NewTrackLocalStaticRTP(track.Codec().RTPCodecCapability, track.ID(), track.StreamID())
		if err != nil {
			log.Println("Failed to create local track:", err)
			return
		}

		_, err = peerConnection.AddTrack(localTrack)
		if err != nil {
			log.Println("Failed to add track:", err)
			return
		}

		// Start frame extraction for video tracks
		if track.Kind() == webrtc.RTPCodecTypeVideo {
			go extractFrames(track)
		}

		// Forward RTP packets
		go func() {
			rtpBuf := make([]byte, 1500)
			for {
				i, _, readErr := track.Read(rtpBuf)
				if readErr != nil {
					return
				}

				if _, writeErr := localTrack.Write(rtpBuf[:i]); writeErr != nil {
					return
				}
			}
		}()
	})

	// Handle ICE connection state changes
	peerConnection.OnICEConnectionStateChange(func(state webrtc.ICEConnectionState) {
		log.Printf("🔗 ICE Connection State: %s", state.String())
	})

	// Handle ICE candidates
	peerConnection.OnICECandidate(func(candidate *webrtc.ICECandidate) {
		if candidate == nil {
			return
		}

		candidateJSON := candidate.ToJSON()
		msg := SignalMessage{
			Type:      "candidate",
			Candidate: &candidateJSON,
		}

		if err := conn.WriteJSON(msg); err != nil {
			log.Println("Error sending ICE candidate:", err)
		}
	})

	// Listen for signaling messages
	for {
		var msg SignalMessage
		if err := conn.ReadJSON(&msg); err != nil {
			log.Println("WebSocket read error:", err)
			break
		}

		switch msg.Type {
		case "offer":
			log.Println("📨 Received offer")
			if err := peerConnection.SetRemoteDescription(*msg.SDP); err != nil {
				log.Println("Failed to set remote description:", err)
				continue
			}

			answer, err := peerConnection.CreateAnswer(nil)
			if err != nil {
				log.Println("Failed to create answer:", err)
				continue
			}

			if err := peerConnection.SetLocalDescription(answer); err != nil {
				log.Println("Failed to set local description:", err)
				continue
			}

			response := SignalMessage{
				Type: "answer",
				SDP:  &answer,
			}

			if err := conn.WriteJSON(response); err != nil {
				log.Println("Failed to send answer:", err)
			}

			log.Println("✅ Sent answer")

		case "candidate":
			if msg.Candidate != nil {
				if err := peerConnection.AddICECandidate(*msg.Candidate); err != nil {
					log.Println("Failed to add ICE candidate:", err)
				}
			}
		}
	}

	peerConnection.Close()
}

// extractFrames captures video frames every 5 seconds and publishes to Redis
func extractFrames(track *webrtc.TrackRemote) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	log.Println("🎬 Frame extraction started")

	// Note: Actual frame decoding from RTP is complex and requires codec-specific handling
	// For MVP, we'll create a placeholder that sends a signal to extract frames
	// In production, you'd use libraries like ffmpeg or gstreamer

	frameCount := 0
	for range ticker.C {
		frameCount++

		// Skip if Redis is not available
		if redisClient == nil {
			continue
		}

		// Create a placeholder frame message
		// In production, you would decode the actual video frame here
		frameMsg := FrameMessage{
			Timestamp: time.Now().Unix(),
			FrameData: "", // Placeholder - would contain base64 JPEG
		}

		data, err := json.Marshal(frameMsg)
		if err != nil {
			log.Println("Failed to marshal frame:", err)
			continue
		}

		// Publish to Redis
		if err := redisClient.Publish(ctx, "video-frames", data).Err(); err != nil {
			log.Println("Failed to publish frame:", err)
		} else {
			log.Printf("📸 Frame #%d published to Redis", frameCount)
		}
	}
}
