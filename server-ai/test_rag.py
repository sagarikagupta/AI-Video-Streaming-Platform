"""
Test script for the Iris AI Engine RAG endpoint
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Check:")
    print(json.dumps(response.json(), indent=2))
    print()

def test_stats():
    """Test stats endpoint"""
    response = requests.get(f"{BASE_URL}/stats")
    print("Stats:")
    print(json.dumps(response.json(), indent=2))
    print()

def test_ask(question: str):
    """Test ask endpoint"""
    response = requests.post(
        f"{BASE_URL}/ask",
        json={"question": question}
    )
    print(f"Question: {question}")
    print("Response:")
    print(json.dumps(response.json(), indent=2))
    print()

if __name__ == "__main__":
    print("=" * 60)
    print("Testing Iris AI Engine")
    print("=" * 60)
    print()
    
    # Test health
    test_health()
    
    # Test stats
    test_stats()
    
    # Test questions
    questions = [
        "What code was being written?",
        "Show me when someone was using the terminal",
        "When was the database discussed?",
        "What programming languages were used?"
    ]
    
    for q in questions:
        test_ask(q)
