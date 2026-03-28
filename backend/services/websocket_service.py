import json
import asyncio
from typing import Any, Optional
from fastapi import WebSocket, WebSocketDisconnect
from services.transcript_manager import TranscriptManager
from services.sales_ai_engine import SalesAIEngine
from services.deepgram_stream import DeepgramStream


class ConnectionManager:

    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.transcript_manager = TranscriptManager()
        self.deepgram_sessions: dict[WebSocket, Any] = {}
        self.ai_engines: dict[WebSocket, SalesAIEngine] = {}
        from services.call_context_engine import call_context_engine
        self.call_context_engine = call_context_engine
        self.final_buffer = ""
        self.debounce_task = None

    async def connect(self, websocket: WebSocket, context_id: str | None = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        
        call_context = None
        if context_id:
            call_context = self.call_context_engine.get_context(context_id)
            
        self.ai_engines[websocket] = SalesAIEngine(call_context=call_context)
        print(f"🔌 Client connected. Active WebSockets: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

        if websocket in self.ai_engines:
            del self.ai_engines[websocket]

        print("❌ Client disconnected.")

        # Note: Deepgram session is closed in handle_audio_stream's finally block (async)
        self.deepgram_sessions.pop(websocket, None)

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
        # ── PROSPECT-ONLY MODE: ignore any speaker label from Deepgram ──────────
        speaker = "prospect"

        self.final_buffer += " " + text

        # cancel previous debounce
        if self.debounce_task:
            self.debounce_task.cancel()

        # start new debounce timer
        self.debounce_task = asyncio.create_task(
            self.flush_after_delay(websocket)
        )

    async def flush_after_delay(self, websocket: WebSocket):
        try:
            await asyncio.sleep(1.2)  # pause detection

            final_text = self.final_buffer.strip()
            self.final_buffer = ""

            if not final_text:
                return

            print(f"📝 Transcript [prospect]: {final_text}")

            # Store transcript
            self.transcript_manager.add_message("prospect", final_text)

            # send ONE clean transcript
            await self.send_personal_message(json.dumps({
                "type": "transcriptUpdate",
                "speaker": "prospect",
                "text": final_text
            }), websocket)

            # trigger AI ONCE
            ai_engine = self.ai_engines.get(websocket)

            if ai_engine:
                try:
                    analysis = await ai_engine.analyze("prospect", final_text)
                    if analysis:
                        await self.send_personal_message(json.dumps({
                            "type": "aiAnalysis",
                            "payload": analysis
                        }), websocket)
                except Exception as e:
                    print(f"❌ [SalesAI] Unhandled pipeline error: {e}")
                    # Don't drop websocket, just log and continue listening

        except asyncio.CancelledError:
            pass

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
                # RECEIVE BINARY AUDIO OR TEXT COMMANDS
                message = await websocket.receive()

                # Starlette sends a disconnect message — exit cleanly
                if message.get("type") == "websocket.disconnect":
                    print("🔌 WebSocket disconnect message received")
                    break

                if "bytes" in message:
                    data = message["bytes"]
                    print(f"📥 received audio chunk: {len(data)} bytes")
                    await dg_stream.send_audio(data)
                elif "text" in message:
                    text_data = message["text"]
                    print(f"📥 received text command: {text_data}")
                    if "close_stream" in text_data:
                        break  # Stop loop cleanly

        except WebSocketDisconnect:
            print("❌ WebSocket disconnected")
        except RuntimeError as e:
            print(f"⚠️ WebSocket runtime error (likely disconnect): {e}")

        finally:
            # Close Deepgram session properly (async) before disconnecting
            dg = self.deepgram_sessions.get(websocket)
            if dg:
                try:
                    await dg.close()
                except Exception as e:
                    print(f"Deepgram close error: {e}")
            self.disconnect(websocket)


websocket_manager = ConnectionManager()