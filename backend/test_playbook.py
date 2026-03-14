import asyncio
import websockets
import json

async def test_websocket():
    # Provide the context ID correctly and mock deepgram websocket bytes
    uri = "ws://localhost:8000/ws"
    
    # We will just test the /ws endpoint which accepts JSON messages for the unified AI engine
    async with websockets.connect(uri) as websocket:
        print("Connected to test websocket")
        
        # Simulate prospect objection
        await websocket.send(json.dumps({"speaker": "prospect", "text": "This pricing seems really expensive just for a transcription tool."}))
        
        # Await responses
        while True:
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                data = json.loads(response)
                print(json.dumps(data, indent=2))
                if data.get("type") == "aiAnalysis":
                    print("\nAI ANALYSIS SUCCESSFUL!\n")
                    break
            except asyncio.TimeoutError:
                print("Timeout waiting for AI response")
                break

asyncio.run(test_websocket())
