import os
import asyncio
from typing import Any
from deepgram import DeepgramClient, LiveOptions, LiveTranscriptionEvents


class DeepgramStream:

    def __init__(self, transcript_callback):
        self.dg = DeepgramClient(os.getenv("DEEPGRAM_API_KEY"))
        self.connection: Any = None
        self.transcript_callback = transcript_callback

        # Speaker role mapping (populated on first/second speaker seen)
        self._speaker_map: dict[int, str] = {}  # {dg_speaker_id: "user" | "prospect"}
        self._next_role = ["user", "prospect"]   # first seen → user, second → prospect

    async def connect(self):
        try:
            self.connection = self.dg.listen.asynclive.v("1")

            options = LiveOptions(
                model="nova-2-general",
                language="en",
                encoding="linear16",
                sample_rate=16000,
                channels=1,
                interim_results=False,
                punctuate=True,
                diarize=True
            )

            # ⚠️ Register handler BEFORE start() — events can fire immediately on connect
            self.connection.on(
                LiveTranscriptionEvents.Transcript,
                self._on_transcript
            )

            await self.connection.start(options)

            print("Deepgram stream connected")
            return True

        except Exception as e:
            print("Exception connecting to Deepgram:", e)
            return False

    def _resolve_speaker(self, dg_speaker_id: int) -> str:
        """
        Maps Deepgram's integer speaker ID to a role label.
        First speaker seen → "user" (the sales rep)
        Second speaker seen → "prospect"
        Any additional speakers → "prospect" (safe default)
        """
        if dg_speaker_id not in self._speaker_map:
            if self._next_role:
                role = self._next_role.pop(0)
            else:
                role = "prospect"   # any 3rd+ speaker defaults to prospect
            self._speaker_map[dg_speaker_id] = role
            print(f"[DIARIZE] Speaker {dg_speaker_id} → '{role}'")
        return self._speaker_map[dg_speaker_id]

    async def _on_transcript(self, *args, **kwargs):
        result = kwargs.get("result") or (args[0] if args else None)
        try:
            if not result or not result.channel or not result.channel.alternatives:
                return

            alt = result.channel.alternatives[0]
            transcript = alt.transcript

            if transcript and transcript.strip():
                print("TRANSCRIPT:", transcript)

                words = alt.words if hasattr(alt, 'words') and alt.words else []

                if words and hasattr(words[0], 'speaker') and words[0].speaker is not None:
                    dg_speaker_id = words[0].speaker
                else:
                    dg_speaker_id = 1

                speaker_role = self._resolve_speaker(dg_speaker_id)

                await self.transcript_callback(speaker_role, transcript)

        except Exception as e:
            print("Transcript processing error:", e)



    async def send_audio(self, chunk):
        try:
            if self.connection:
                await self.connection.send(chunk)
        except Exception as e:
            print("Audio send error:", e)

    async def close(self):
        try:
            if self.connection:
                await self.connection.finish()
        except Exception as e:
            print("Deepgram close error:", e)