import os
from deepgram import DeepgramClient, LiveOptions, LiveTranscriptionEvents


class DeepgramStream:

    def __init__(self, transcript_callback):
        self.dg = DeepgramClient(os.getenv("DEEPGRAM_API_KEY"))
        self.connection = None
        self.transcript_callback = transcript_callback

    async def connect(self):
        try:
            # create deepgram streaming connection
            self.connection = self.dg.listen.asynclive.v("1")

            options = LiveOptions(
                model="nova-2",
                language="en",
                encoding="linear16",
                sample_rate=16000,
                channels=1,
                interim_results=False,
                punctuate=True
            )

            # start the stream
            await self.connection.start(options)

            # register transcript event
            self.connection.on(
                LiveTranscriptionEvents.Transcript,
                self._on_transcript
            )

            print("Deepgram stream connected")
            return True

        except Exception as e:
            print("Exception connecting to Deepgram:", e)
            return False

    async def _on_transcript(self, connection, result, **kwargs):
        """
        Deepgram passes (connection, result, **kwargs)
        """

        try:
            if not result.channel.alternatives:
                return

            transcript = result.channel.alternatives[0].transcript

            if transcript:
                print("TRANSCRIPT:", transcript)

                # send transcript back to websocket pipeline
                await self.transcript_callback("prospect", transcript)

        except Exception as e:
            print("Transcript processing error:", e)

    async def send_audio(self, chunk):
        try:
            if self.connection:
                await self.connection.send(chunk)
        except Exception as e:
            print("Audio send error:", e)

    def close(self):
        try:
            if self.connection:
                self.connection.finish()
        except Exception as e:
            print("Deepgram close error:", e)