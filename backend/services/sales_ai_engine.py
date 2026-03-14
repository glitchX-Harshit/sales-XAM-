import os
import json
import time
import asyncio
from openai import AsyncOpenAI
# from services.objection_engine import detect_objection # DEPRECATED
# from services.suggestion_engine import generate_response_suggestion # DEPRECATED
from services.conversation_analyzer import conversation_analyzer
from services.persuasion_engine import persuasion_engine
from services.suggestion_manager import suggestion_manager

api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
) if api_key else None

class SalesAIEngine:
    def __init__(self, call_context: dict = None):
        self.call_context = call_context
        self.message_buffer = []
        self.max_messages = 8
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
        
        # We loop at most twice: 1 normal attempt, 1 retry if duplicate
        for retry_attempt in range(2):
            self._record_call()
            
            # 1. Analyze Conversation - explicitly pass text or buffer
            analysis_result = await conversation_analyzer.analyze_conversation(self.message_buffer)
            intent = analysis_result.get("intent", "none")
            topic = analysis_result.get("topic", "none")
            latest_prospect_msg = analysis_result.get("latest_message", text)
            print(f"[AI_PIPELINE] Det. Intent: {intent} | Det. Topic: {topic}")

            # 2. Select Strategy
            selected_strategy_name = persuasion_engine.select_strategy(topic)
            strategy_name = selected_strategy_name
            strategy_context = f"""
    A preferred persuasion strategy has been suggested: {selected_strategy_name}.
    Use this strategy if it fits the conversation, but you may adapt or choose a better approach if needed.
    Avoid repeating the same persuasion technique.
    """
            print(f"[AI_PIPELINE] Persuasion strategy selected: {selected_strategy_name}")

            if not client:
                return await self._run_fallback(intent, topic, latest_prospect_msg)

            context_str = ""
            if self.call_context:
                context_str = "\n\nYou have access to the following call context:\n"
                context_str += "\n".join([f"- {k.replace('_', ' ').capitalize()}: {v}" for k, v in self.call_context.items()])
                context_str += "\n\nUse this context to generate more personalized persuasion strategies."
                
            dup_warning = "WARNING: Previous generation was too similar to older suggestions. You MUST generate a DIFFERENT sentence structure/angle this time." if retry_attempt > 0 else ""

            system_content = f"""You are an elite B2B sales strategist assisting a salesperson during a live call.
    {context_str}{strategy_context}
    
    Your job is to:
    1. Understand the prospect's latest message exactly.
    2. Respond to the intent and topic mapped out.
    3. Choose the most effective persuasion strategy (use the recommendation if provided).
    4. Provide a SHORT, conversational reply for the rep to say verbatim.
    5. Suggest a follow-up question that moves the deal forward.

    {dup_warning}
    Avoid generic chatbot language. Keep it human-like.
    """
            prompt = f"""
            Analyze the following recent conversation snippet (sliding window).
            
            Previous Context:
            {json.dumps(self.message_buffer[:-1])}
            
            LATEST PROSPECT MESSAGE (Respond to this specifically):
            "{latest_prospect_msg}"
            
            Return ONLY a JSON object with exactly these fields:
            - "intent": "{intent}"
            - "topic": "{topic}"
            - "persuasion_pattern": "<SELECTED_PATTERN>" 
            - "suggested_response": "Short conversational line the rep can say"
            - "next_best_question": "Question that moves the deal forward"
            - "deal_signal": "positive" | "neutral" | "negative"
            - "confidence": Float between 0.0 and 1.0 representing confidence in the detection.
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
                        temperature=0.3 + (retry_attempt * 0.4) # Increase temp on retry to force variance
                    ),
                    timeout=self.max_latency
                )
                
                content = response.choices[0].message.content
                data = json.loads(content)
                
                confidence = float(data.get("confidence", 0.0))
                if confidence < self.confidence_threshold:
                    print(f"[AI_RESPONSE] Confidence {confidence} below threshold. Ignoring.")
                    return None
                    
                suggested_resp = data.get("suggested_response", "")
                
                # Check for duplicate suggestions
                if suggestion_manager.is_duplicate(suggested_resp) and retry_attempt == 0:
                    print(f"[AI_SUGGESTION] Duplicate detected: '{suggested_resp}'. Retrying...")
                    continue # Try one more time with higher temp
                    
                print("[AI_RESPONSE] Analysis successful.")
                suggestion_manager.add_suggestion(suggested_resp) # Record to history
                
                # Normalize keys for the frontend
                data["type"] = topic
                
                return data
                
            except asyncio.TimeoutError:
                print(f"[AI_TIMEOUT] LLM Timeout exceeded ({self.max_latency}s).")
                return None
            except json.JSONDecodeError:
                print("[AI_ERROR] Invalid JSON from LLM. Falling back.")
                return await self._run_fallback(intent, topic, latest_prospect_msg)
            except Exception as e:
                print(f"[AI_ERROR] Pipeline exception: {e}")
                return await self._run_fallback(intent, topic, latest_prospect_msg)
                
        # If we exit loop due to max retries on duplicates, return None (silence is better than bad repeats)
        print("[AI_ERROR] Exceeded retries on duplicate suggestions. Terminating generation.")
        return None
            
    async def _run_fallback(self, intent: str, topic: str, latest_msg: str) -> dict | None:
        print("[AI_TRIGGERED] Running fallback pipeline...")
        return {
            "intent": intent,
            "topic": topic,
            "persuasion_pattern": "DIRECT_RESPONSE",
            "suggested_response": "I completely understand where you're coming from. Can you tell me more about that?",
            "next_best_question": "What specifically is the main concern?",
            "deal_signal": "neutral",
            "type": topic
        }
