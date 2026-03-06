import os
from deepgram import DeepgramClient, LiveOptions

class DeepgramStream:

    def __init__(self, transcript_callback):
        self.dg = DeepgramClient(os.getenv("DEEPGRAM_API_KEY"))
        self.connection = None
        self.transcript_callback = transcript_callback

    async def connect(self):
        try:
            self.connection = self.dg.listen.asynclive.v("1")

            options = LiveOptions(
                model="nova-2",
                language="en",
                encoding="linear16",
                sample_rate=16000,
                channels=1,
                interim_results=False
            )

            await self.connection.start(options)

            self.connection.on("transcript", self._on_transcript)

            print("Deepgram stream connected")

            return True

        except Exception as e:
            print("Exception connecting to Deepgram:", e)
            return False

    async def _on_transcript(self, result, **kwargs):
        try:
            transcript = result.channel.alternatives[0].transcript

            if transcript:
                await self.transcript_callback("prospect", transcript)

        except Exception:
            pass

    async def send_audio(self, chunk):
        if self.connection:
            await self.connection.send(chunk)

    def close(self):
        if self.connection:
            self.connection.finish()
