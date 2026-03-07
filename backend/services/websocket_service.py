import json
from fastapi import WebSocket, WebSocketDisconnect
from services.transcript_manager import TranscriptManager
from services.objection_engine import detect_objection
from services.suggestion_engine import generate_response_suggestion
from services.deepgram_stream import DeepgramStream


class ConnectionManager:

    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.transcript_manager = TranscriptManager()
        self.deepgram_sessions = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"🔌 Client connected. Active WebSockets: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

        print("❌ Client disconnected.")

        if websocket in self.deepgram_sessions:
            dg = self.deepgram_sessions.pop(websocket)
            try:
                dg.close()
            except Exception:
                pass

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception:
            self.disconnect(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)

    # ==============================
    # AI PIPELINE
    # ==============================

    async def handle_new_transcript(self, speaker: str, text: str, websocket: WebSocket):

        print(f"📝 Transcript: {speaker}: {text}")

        # Store transcript
        self.transcript_manager.add_message(speaker, text)

        # Send transcript to frontend
        await self.send_personal_message(json.dumps({
            "type": "transcriptUpdate",
            "speaker": speaker,
            "text": text
        }), websocket)

        # Detect objection
        context = self.transcript_manager.get_recent_context()
        objection_json = await detect_objection(context)

        if objection_json:

            try:
                objection_data = json.loads(objection_json)

                await self.send_personal_message(json.dumps({
                    "type": "objectionDetect",
                    "objection": objection_data
                }), websocket)

                # Generate suggestion
                objection_type = objection_data.get("type")

                suggestion_json = await generate_response_suggestion(
                    objection_type,
                    context
                )

                if suggestion_json:
                    suggestion_data = json.loads(suggestion_json)

                    await self.send_personal_message(json.dumps({
                        "type": "aiSuggestion",
                        "suggestion": suggestion_data
                    }), websocket)

            except Exception as e:
                print("❌ Error parsing AI response:", e)

    # ==============================
    # AUDIO STREAM HANDLER
    # ==============================

    async def handle_audio_stream(self, websocket: WebSocket):

        print("🎧 Initializing Deepgram audio stream...")

        async def on_transcript(speaker: str, text: str):
            await self.handle_new_transcript(speaker, text, websocket)

        dg_stream = DeepgramStream(transcript_callback=on_transcript)

        connected = await dg_stream.connect()

        if not connected:
            print("❌ Failed to connect to Deepgram")
            return

        print("✅ Deepgram stream connected")

        self.deepgram_sessions[websocket] = dg_stream

        try:

            while True:

                # RECEIVE BINARY AUDIO
                data = await websocket.receive_bytes()

                print(f"📥 received audio chunk: {len(data)} bytes")

                await dg_stream.send_audio(data)

        except WebSocketDisconnect:
            print("❌ WebSocket disconnected")

        finally:
            self.disconnect(websocket)


websocket_manager = ConnectionManager()