import os
import json
import time
import asyncio
from typing import Any
from openai import AsyncOpenAI
from difflib import SequenceMatcher

api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
) if api_key else None


class SalesAIEngine:
    def __init__(self, call_context: dict[str, Any] | None = None):
        self.call_context = call_context
        self.message_buffer: list[dict[str, Any]] = []
        self.response_history: list[str] = []
        self.last_strategies: list[str] = []
        
        self.max_messages = 8
        self.max_latency = 2.0  # V2 2-sec strict limit
        self._last_call_time: float = 0.0
        self._cooldown_secs: float = 2.0  # Min 2 secs between calls

    def add_message(self, speaker: str, text: str):
        self.message_buffer.append({"speaker": speaker, "text": text, "timestamp": time.time()})
        if len(self.message_buffer) > self.max_messages:
            self.message_buffer.pop(0)

    def is_duplicate(self, text: str) -> bool:
        if not text:
            return False
        text_lower = text.lower()
        for past_sugg in self.response_history:
            if SequenceMatcher(None, text_lower, past_sugg.lower()).ratio() > 0.70:
                return True
        return False

    def push_response_history(self, response: str, strategy: str):
        self.response_history.append(response)
        if len(self.response_history) > 3:
            self.response_history.pop(0)
            
        if strategy:
            self.last_strategies.append(strategy)
            # Avoid repeating last 2 used strategies
            if len(self.last_strategies) > 2:
                self.last_strategies.pop(0)

    def smart_fallback(self) -> dict:
        """
        V2 Fallback System: Short strategic question instead of long explanation.
        """
        print("[FALLBACK] Using V2 short strategic fallback.")
        fallback_msg = "Can I ask — what's the main hesitation right now?"
        return {
            "intent": "hesitation",
            "stage": "objection",
            "strategy": "DIAGNOSTIC_QUESTION",
            "confidence": 1.0,
            "response": fallback_msg,
            "next_question": fallback_msg,
            "coaching_tip": "API failed. Use this to keep the prospect talking."
        }

    async def analyze(self, speaker: str, text: str) -> dict | None:
        print(f"[TRANSCRIPT] {speaker}: {text}")

        # V2 Trigger Control
        if speaker != "prospect":
            return None

        # Pass transcripts containing useful words
        if len(text.strip().split()) < 3 and len(text.strip()) < 15:
            print("[AI_SKIPPED] Transcript too short.")
            self.add_message(speaker, text)
            return None

        now = time.time()
        if now - self._last_call_time < self._cooldown_secs:
            print("[AI_SKIPPED] Cooldown active.")
            return None
            
        self._last_call_time = now
        self.add_message(speaker, text)

        print("[AI_TRIGGERED] V2 CloserBrain analyzing...")

        if not client:
            print("[AI_INFO] No LLM client configured — using fallback.")
            return self.smart_fallback()

        context_str = ""
        if self.call_context:
            context_str = "\nCall context:\n" + "\n".join([f"- {k}: {v}" for k, v in self.call_context.items()])

        avoid_strategies = ", ".join(self.last_strategies) if self.last_strategies else "None"

        system_content = f"""You are "CloserBrain V2" - an elite B2B sales closing engine.

{context_str}

CORE DIRECTIVES:
- Transform from reactive responder to strategic deal closer.
- Lead the conversation; do not just answer questions blindly.
- Never sound desperate. Avoid long explanations.
- Mix statements and questions. Use confident, guiding tone.

AVAILABLE STRATEGIES (Pick EXACTLY ONE based on intent):
- ROI_REFRAME (for pricing intent - show value vs cost)
- COST_OF_INACTION (for hesitation intent - highlight missed opportunity)
- SOCIAL_PROOF (for trust intent - case study/others success)
- DIAGNOSTIC_QUESTION (for confusion intent - ask smart question)
- FUTURE_PACING (for interest intent - paint future outcome)
- PILOT_CLOSE (for closing/ready bounds - low risk entry)
- DECISION_CONTROL (for authority - uncover decision process)

RESTRICTIONS:
- Do NOT use these recently used strategies: [{avoid_strategies}]
- Keep "response" punchy, confident, and under 2 sentences.
- DO NOT start with "Our product helps you increase..." or repetitive pleasantries.

OUTPUT STRICT JSON WITH EXACTLY THESE KEYS:
- "intent": (pricing|trust|timeline|authority|confusion|interest|neutral|hesitation)
- "stage": (discovery|problem|objection|closing)
- "strategy": (ONE OF THE 7 STRATEGIES ABOVE)
- "confidence": Float 0.0-1.0
- "response": (Your core short confident statement)
- "next_question": (A direct follow-up question to advance the deal)
- "coaching_tip": (A brief 1-sentence tip on body language or tone)
"""

        prev_context = list(self.message_buffer[:-1])

        prompt = f"""
Conversation Buffer:
{json.dumps(prev_context)}

LATEST PROSPECT MESSAGE:
"{text}"

Output strictly conforming JSON.
"""

        for attempt in range(2):
            try:
                llm_response = await asyncio.wait_for(
                    client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=[
                            {"role": "system", "content": system_content},
                            {"role": "user", "content": prompt}
                        ],
                        response_format={"type": "json_object"},
                        temperature=0.3 + (attempt * 0.4),
                    ),
                    timeout=self.max_latency
                )

                content = llm_response.choices[0].message.content
                data = json.loads(content)

                suggested_resp = data.get("response", "").strip()
                if not suggested_resp:
                    return self.smart_fallback()

                # Anti-Repetition logic
                if self.is_duplicate(suggested_resp) and attempt == 0:
                    print(f"[AI_DUPLICATE] Repetition block triggered! Retrying... '{suggested_resp[:30]}'")
                    continue

                self.push_response_history(suggested_resp, data.get("strategy"))

                # Output Normalization for existing frontend fields
                data["suggested_response"] = suggested_resp
                data["next_best_question"] = data.get("next_question", "")
                data["persuasion_pattern"] = data.get("strategy", "")
                data["type"] = data.get("intent", "")
                data["deal_stage"] = data.get("stage", "")

                print(f"[AI_RESPONSE] ✅ {data.get('strategy', 'NONE')} | {suggested_resp[:60]}...")
                return data

            except asyncio.TimeoutError:
                print(f"[AI_TIMEOUT] Exceeded {self.max_latency}s SLA limit. Forcing fallback.")
                return self.smart_fallback()
            except (json.JSONDecodeError, Exception) as e:
                print(f"[AI_ERROR] Engine Error: {e}")
                return self.smart_fallback()

        return self.smart_fallback()
