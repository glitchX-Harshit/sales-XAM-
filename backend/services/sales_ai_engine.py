import os
import json
import time
import asyncio
from openai import AsyncOpenAI
from services.objection_engine import detect_objection
from services.suggestion_engine import generate_response_suggestion

api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
) if api_key else None

class SalesAIEngine:
    def __init__(self):
        self.message_buffer = []
        self.max_messages = 10
        self.min_messages = 2
        self.cooldown_messages = 1
        self.messages_since_last_trigger = 0
        self.keywords = [
            "price", "pricing", "budget", "cost", "expensive", 
            "timeline", "when", "how long", "decision", "manager", 
            "approval", "competitor", "contract", "integrate", "integration"
        ]
        self.confidence_threshold = 0.6
        self.max_latency = 6.0  # seconds
        
        # Rate limiting
        self.call_timestamps = []
        self.max_calls_per_minute = 12

        self.persona = "spin" # Default persona

    def add_message(self, speaker: str, text: str):
        message = {"speaker": speaker, "text": text, "timestamp": time.time()}
        self.message_buffer.append(message)
        
        if len(self.message_buffer) > self.max_messages:
            self.message_buffer.pop(0)  # FIFO eviction

    def _check_rate_limit(self) -> bool:
        now = time.time()
        self.call_timestamps = [t for t in self.call_timestamps if now - t < 60]
        if len(self.call_timestamps) >= self.max_calls_per_minute:
            return False
        return True

    def _record_call(self):
        self.call_timestamps.append(time.time())

    def _should_trigger(self, speaker: str, text: str) -> bool:
        print("[AI_TRIGGER_CHECK] Evaluating trigger conditions...")
        if speaker != "prospect":
            print("[AI_SKIPPED] Speaker is not prospect.")
            return False
            
        self.messages_since_last_trigger += 1
        text_lower = text.lower()
        has_keyword = any(kw in text_lower for kw in self.keywords)
        
        if has_keyword or self.messages_since_last_trigger >= self.cooldown_messages:
            if len(self.message_buffer) >= self.min_messages:
                return True
            else:
                print(f"[AI_SKIPPED] Buffer too small ({len(self.message_buffer)} < {self.min_messages}).")
        else:
            print("[AI_SKIPPED] No keyword match and cooldown not reached.")
                
        return False

    async def analyze(self, speaker: str, text: str) -> dict | None:
        print(f"[TRANSCRIPT_RECEIVED] {speaker}: {text}")
        self.add_message(speaker, text)
        
        if not self._should_trigger(speaker, text):
            return None
            
        if not self._check_rate_limit():
            print("[AI_SKIPPED] Rate limit exceeded. Dropping request.")
            return None
            
        print("[AI_TRIGGERED] Running sales insights analysis...")
        self.messages_since_last_trigger = 0
        self._record_call()
        
        if not client:
            return await self._run_fallback()
            
        system_content = f"You are an elite B2B sales coach using the {self.persona.upper()} selling methodology."
        prompt = f"""
        Analyze the following recent conversation snippet (sliding window).
        
        Conversation:
        {json.dumps(self.message_buffer)}
        
        Generate a precise, high-converting response suggestion and sales coaching insights for the sales rep.
        Return ONLY a JSON object with exactly these fields:
        - "spin_stage": one of ["situation", "problem", "implication", "need_payoff"]
        - "objection_type": one of ["pricing", "timeline", "trust", "authority", "need", "competitor", "none"]
        - "confidence": Float between 0.0 and 1.0 representing confidence in the detection.
        - "suggested_response": A short, recommended reply for the salesperson to say next.
        - "coaching_tip": A 1-sentence sales strategy guidance.
        - "next_best_question": A question that moves the conversation forward.
        """
        
        try:
            response = await asyncio.wait_for(
                client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": system_content},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.2
                ),
                timeout=self.max_latency
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            
            confidence = float(data.get("confidence", 0.0))
            if confidence < self.confidence_threshold:
                print(f"[AI_RESPONSE] Confidence {confidence} below threshold. Ignoring.")
                return None
                
            print("[AI_RESPONSE] Analysis successful.")
            return data
            
        except asyncio.TimeoutError:
            print(f"[AI_TIMEOUT] LLM Timeout exceeded ({self.max_latency}s). Skipping update.")
            return None
        except json.JSONDecodeError:
            print("[AI_ERROR] Invalid JSON from LLM. Falling back.")
            return await self._run_fallback()
        except Exception as e:
            print(f"[AI_ERROR] Pipeline exception: {e}")
            return await self._run_fallback()
            
    async def _run_fallback(self) -> dict | None:
        print("[AI_TRIGGERED] Running fallback pipeline...")
        context = [{"speaker": m["speaker"], "text": m["text"]} for m in self.message_buffer]
        objection_json = await detect_objection(context)
        
        if objection_json:
            try:
                objection_data = json.loads(objection_json)
                obj_type = objection_data.get("type", "none")
                confidence = float(objection_data.get("confidence", 0.0))
                
                if confidence < self.confidence_threshold:
                    return None
                    
                suggestion_json = await generate_response_suggestion(obj_type, context)
                if suggestion_json:
                    suggestion_data = json.loads(suggestion_json)
                    return {
                        "spin_stage": "problem",
                        "objection_type": obj_type,
                        "confidence": confidence,
                        "suggested_response": suggestion_data.get("text", ""),
                        "coaching_tip": suggestion_data.get("strategy", ""),
                        "next_best_question": "What are your specific requirements?"
                    }
            except Exception as e:
                print(f"[AI_ERROR] Fallback failed: {e}")
        return None
