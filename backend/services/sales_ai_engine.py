import os
import json
import time
import asyncio
from typing import Any
from openai import AsyncOpenAI
from services.conversation_analyzer import conversation_analyzer
from services.persuasion_engine import persuasion_engine
from services.suggestion_manager import suggestion_manager
from services.deal_stage_engine import deal_stage_engine

api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
) if api_key else None


class SalesAIEngine:
    def __init__(self, call_context: dict[str, Any] | None = None):
        self.call_context = call_context
        self.message_buffer: list[dict[str, Any]] = []
        self.max_messages = 8
        self.max_latency = 6.0          # LLM timeout in seconds
        self.confidence_threshold = 0.0  # Accept all responses — fallback handles bad ones
        self._last_response: str = ""
        self._last_call_time: float = 0.0
        self._cooldown_secs: float = 1.0  # Min seconds between AI triggers

    # ── Buffer management ──────────────────────────────────────────────────────

    def add_message(self, speaker: str, text: str):
        self.message_buffer.append({"speaker": speaker, "text": text, "timestamp": time.time()})
        if len(self.message_buffer) > self.max_messages:
            self.message_buffer.pop(0)  # FIFO eviction

    # ── Smart context-aware fallback ───────────────────────────────────────────

    def smart_fallback(self, text: str, intent: str = "none", topic: str = "none",
                       deal_stage: str = "discovery") -> dict:
        """
        Keyword-matched fallback responses — never empty, never dumb.
        Triggered when LLM is rate-limited, timed out, or unavailable.
        """
        t = text.lower()

        if any(kw in t for kw in ["price", "cost", "budget", "expensive", "cheap", "charge"]):
            suggested = ("Totally fair — most teams feel that initially. "
                         "But usually they recover the cost with just one extra closed client. "
                         "Would you be open to seeing how that math works?")
            strategy = "fallback_pricing"

        elif any(kw in t for kw in ["time", "when", "long", "fast", "quick", "soon", "timeline"]):
            suggested = ("Good question — typically you start seeing movement within a few weeks, "
                         "depending on how aggressively you implement it. What timeline are you aiming for?")
            strategy = "fallback_timeline"

        elif any(kw in t for kw in ["not interested", "don't need", "no thanks", "pass", "already have"]):
            suggested = ("Got it — just so I understand, is it timing, or does it not feel relevant right now?")
            strategy = "fallback_recovery"

        elif any(kw in t for kw in ["how", "what", "explain", "tell me", "help", "work", "does it"]):
            suggested = ("Great question. The simplest way to think about it: "
                         "it removes the friction between your top performers and everyone else. "
                         "What does that gap look like on your team right now?")
            strategy = "fallback_discovery"

        elif any(kw in t for kw in ["competitor", "alternative", "other", "vs", "compare"]):
            suggested = ("Fair — most people look around. The real question is what specifically "
                         "you're benchmarking on. What matters most to you in this decision?")
            strategy = "fallback_competitive"

        else:
            suggested = ("Makes sense. Let me ask — what would need to happen for this "
                         "to feel like a no-brainer for you?")
            strategy = "fallback_generic"

        print(f"[FALLBACK] Strategy: {strategy} | Response: {suggested[:60]}...")
        return {
            "intent": intent,
            "topic": topic,
            "stage": deal_stage,
            "deal_stage": deal_stage,
            "strategy": strategy,
            "persuasion_pattern": strategy,
            "tone": "calm_authority",
            "response": suggested,
            "suggested_response": suggested,
            "next_question": "What would make this decision easier for you?",
            "next_best_question": "What would make this decision easier for you?",
            "type": topic,
            "confidence": 1.0,
        }

    # ── Main analysis entry point ──────────────────────────────────────────────

    async def analyze(self, speaker: str, text: str) -> dict | None:
        print(f"[TRANSCRIPT_RECEIVED] {speaker}: {text}")

        # ── Gate 1: prospect-only ─────────────────────────────────────────────
        if speaker != "prospect":
            return None

        if not text.strip():
            return None

        # ── Gate 2: per-message cooldown (1 second) ────────────────────────────
        now = time.time()
        if now - self._last_call_time < self._cooldown_secs:
            print("[AI_SKIPPED] Cooldown — too fast. Skipping.")
            return None
        self._last_call_time = now

        # Always add to buffer (after cooldown check)
        self.add_message(speaker, text)

        print("[AI_TRIGGERED] Running sales insights analysis...")

        # ── Lightweight heuristics (zero-latency) ─────────────────────────────
        intent, topic, deal_stage = "none", "none", "discovery"
        try:
            analysis_result = await conversation_analyzer.analyze_conversation(self.message_buffer)
            intent = analysis_result.get("intent", "none")
            topic = analysis_result.get("topic", "none")
        except Exception as e:
            print(f"[ANALYZER_ERROR] {e}")

        try:
            deal_stage = deal_stage_engine.detect_stage(self.message_buffer)
        except Exception as e:
            print(f"[STAGE_ERROR] {e}")

        print(f"[AI_PIPELINE] Intent: {intent} | Topic: {topic} | Stage: {deal_stage}")

        selected_strategy = "straight_line"
        try:
            selected_strategy = persuasion_engine.select_strategy(topic)
        except Exception as e:
            print(f"[STRATEGY_ERROR] {e}")

        latest_prospect_msg = text

        # ── LLM call (with fallback on ANY error) ─────────────────────────────
        if not client:
            print("[AI_INFO] No LLM client configured — using smart fallback.")
            return self.smart_fallback(text, intent, topic, deal_stage)

        context_str = ""
        ctx = self.call_context
        if ctx:
            context_str = "\n\nCall context:\n"
            context_str += "\n".join([f"- {k.replace('_', ' ').capitalize()}: {v}" for k, v in ctx.items()])
            context_str += "\n\nUse this to personalise your suggestions."

        stage_guidance = {
            "discovery":           "Ask diagnostic questions to understand the prospect's world.",
            "problem_exploration":  "Uncover deeper pain points — ask why, how long, what impact.",
            "solution_framing":     "Connect the product to the prospect's stated problem.",
            "objection_handling":   "Reframe concerns, reduce perceived risk, rebuild confidence.",
            "negotiation":          "Defend value firmly. Anchor on ROI. No premature discounts.",
            "closing":              "Guide toward a concrete next step. Create momentum.",
        }.get(deal_stage, "Guide the deal forward.")

        system_content = f"""You are a high-performance sales closer — not an assistant.
{context_str}
Persuasion strategy suggested: {selected_strategy}.
CURRENT DEAL STAGE: {deal_stage.upper().replace('_', ' ')}
Stage guidance: {stage_guidance}

Rules:
- Respond with calm authority
- Be concise and powerful
- Challenge assumptions slightly
- Never repeat a previous response
- Always guide toward the next step
Tone options: [calm_authority, slightly_challenging, confident_minimal]
"""

        prev_context = list(self.message_buffer[:-1])  # exclude current message

        prompt = f"""
Conversation so far:
{json.dumps(prev_context)}

LATEST PROSPECT MESSAGE (respond specifically to this):
"{latest_prospect_msg}"

Return ONLY a JSON object with exactly these fields:
- "intent": detected intent string
- "stage": "{deal_stage}"
- "strategy": selected persuasion pattern
- "tone": selected tone
- "response": short, powerful line the rep can say right now
- "next_question": question that moves the deal to the next stage
- "confidence": float 0.0–1.0
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
                        temperature=0.3 + (attempt * 0.4),  # raise temp on retry
                    ),
                    timeout=self.max_latency
                )

                content = llm_response.choices[0].message.content
                data = json.loads(content)

                suggested_resp = data.get("response", "").strip()
                if not suggested_resp:
                    print("[AI_WARN] Empty response from LLM. Falling back.")
                    return self.smart_fallback(text, intent, topic, deal_stage)

                # ── Duplicate guard ───────────────────────────────────────────
                if suggested_resp == self._last_response and attempt == 0:
                    print("[AI_DUPLICATE] Same as last response. Retrying with higher temp...")
                    continue

                if suggestion_manager.is_duplicate(suggested_resp) and attempt == 0:
                    print(f"[AI_DUPLICATE] History duplicate: '{suggested_resp[:40]}'. Retrying...")
                    continue

                self._last_response = suggested_resp
                suggestion_manager.add_suggestion(suggested_resp)

                # Normalise output keys for frontend compatibility
                data["suggested_response"] = suggested_resp
                data["next_best_question"] = data.get("next_question", "")
                data["persuasion_pattern"] = data.get("strategy", selected_strategy)
                data["type"] = topic
                data["deal_stage"] = deal_stage

                print(f"[AI_RESPONSE] ✅ Success. Response: {suggested_resp[:60]}...")
                return data

            except asyncio.TimeoutError:
                print(f"[AI_TIMEOUT] LLM timed out after {self.max_latency}s. Using fallback.")
                return self.smart_fallback(text, intent, topic, deal_stage)

            except json.JSONDecodeError:
                print("[AI_ERROR] Invalid JSON from LLM. Using fallback.")
                return self.smart_fallback(text, intent, topic, deal_stage)

            except Exception as e:
                print(f"[AI_ERROR] LLM error (attempt {attempt + 1}): {e}")
                # Don't retry on rate-limit — go straight to fallback
                return self.smart_fallback(text, intent, topic, deal_stage)

        # Both attempts exhausted (only happens with back-to-back duplicates)
        print("[AI_WARN] Max retries hit. Using fallback.")
        return self.smart_fallback(text, intent, topic, deal_stage)
