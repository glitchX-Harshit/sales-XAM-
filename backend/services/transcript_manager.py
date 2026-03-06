class TranscriptManager:
    def __init__(self, buffer_size=20):
        self.buffer = []
        self.buffer_size = buffer_size

    def add_message(self, speaker: str, text: str):
        self.buffer.append({"speaker": speaker, "text": text})
        if len(self.buffer) > self.buffer_size:
            self.buffer.pop(0)

    def get_recent_context(self):
        return self.buffer

transcript_buffer = TranscriptManager()
