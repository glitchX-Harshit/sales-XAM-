import os
import json
import asyncio
from openai import AsyncOpenAI

api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
) if api_key else None


class ConversationAnalyzer:
    def __init__(self):
        self.max_latency = 6.0

    async def analyze_conversation(self, message_buffer: list[dict]) -> dict:
        """
        Takes the current message buffer and returns a structured analysis of the conversation,
        prioritizing the LATEST prospect message.
        """
        # Get the latest message, filter for prospect
        prospect_messages = [m for m in message_buffer if m["speaker"] == "prospect"]
        latest_message = prospect_messages[-1]["text"] if prospect_messages else ""
        
        if not latest_message:
            return {
                "latest_message": "",
                "intent": "none",
                "topic": "none",
                "confidence": 0.0
            }

        if not client:
            print("[Analyzer] No LLM client. Falling back to heuristic.")
            return self._fallback_analysis(latest_message)

        system_prompt = """
        You are an expert intent and topic classifier for B2B sales.
        Analyze the *LATEST* message from the prospect. Use previous messages for context, but classify *ONLY* the latest message.
        
        Return ONLY a JSON object with:
        - "latest_message": String (the exact text of the latest prospect message)
        - "intent": strict choice array ["objection", "question", "interest", "negotiation", "hesitation", "consideration", "small_talk", "none"]
        - "topic": strict choice array ["pricing", "timeline", "authority", "competitor", "trust", "value", "implementation", "next_steps", "none"]
        - "confidence": Float between 0.0 and 1.0 representing your confidence in this classification.
        """

        prompt = f"Previous Context:\n{json.dumps(message_buffer[:-1])}\n\nLatest Prospect Message to Analyze:\n{latest_message}"

        try:
            response = await asyncio.wait_for(
                client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.1
                ),
                timeout=self.max_latency
            )

            content = response.choices[0].message.content
            data = json.loads(content)
            
            # Normalization function as requested by the user
            def normalize_value(value):
                if isinstance(value, list):
                    return value[0] if value else None
                return value

            raw_intent = normalize_value(data.get("intent"))
            raw_topic = normalize_value(data.get("topic"))

            return {
                "latest_message": data.get("latest_message", latest_message),
                "intent": raw_intent if isinstance(raw_intent, str) else "none",
                "topic": raw_topic if isinstance(raw_topic, str) else "none",
                "confidence": data.get("confidence", 0.0)
            }

        except Exception as e:
            print(f"[Analyzer] LLM Analysis failed: {e}. Falling back to heuristic.")
            return self._fallback_analysis(latest_message)

    def _fallback_analysis(self, latest_message: str) -> dict:
        # Simple heuristic fallback based on latest prospect message
        text = latest_message.lower()
        
        topic = "none"
        intent = "small_talk"
        
        if any(w in text for w in ["price", "cost", "expensive", "budget"]):
            topic = "pricing"
            intent = "objection"
        elif any(w in text for w in ["boss", "manager", "vp", "sign off"]):
            topic = "authority"
            intent = "hesitation"
        elif any(w in text for w in ["when", "time", "later", "next quarter"]):
            topic = "timeline"
            if "?" in text: intent = "question"
            else: intent = "objection"
        elif any(w in text for w in ["competitor", "other tool", "currently use"]):
            topic = "competitor"
            intent = "objection"
        elif "?" in text:
            intent = "question"

        return {
            "latest_message": latest_message,
            "intent": intent,
            "topic": topic,
            "confidence": 0.5
        }

conversation_analyzer = ConversationAnalyzer()
