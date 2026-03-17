from typing import Any, Dict, List

class DealStageEngine:
    """
    Detects the current deal stage from recent conversation transcript.
    Uses keyword heuristics — zero LLM calls, zero latency overhead.
    
    Stages (in order of progression):
      discovery → problem_exploration → solution_framing →
      objection_handling → negotiation → closing
    """

    STAGE_KEYWORDS: Dict[str, List[str]] = {
        "closing": [
            "next step", "how do we start", "move forward", "sign up",
            "when can we begin", "let's do it", "send the contract",
            "ready to proceed", "onboard", "get started"
        ],
        "negotiation": [
            "discount", "cheaper", "lower price", "reduce the cost",
            "better deal", "price", "can you do better", "negotiate",
            "flexible on pricing", "best price"
        ],
        "objection_handling": [
            "expensive", "not sure", "don't think", "not convinced",
            "too much", "not ready", "we'll see", "concerned about",
            "not a priority", "already have", "competitor"
        ],
        "solution_framing": [
            "how will this help", "how would this help", "how would this work",
            "what does it improve", "what results", "can it solve", "does it handle",
            "how does it fix", "show me how", "what would change", "would this help",
            "help our team", "help my team", "help us"
        ],
        "problem_exploration": [
            "our problem is", "our challenge is", "we struggle with",
            "biggest issue", "biggest problem", "pain point", "difficulty", "failing at",
            "not working", "bottleneck", "frustration", "converting leads",
            "hard time", "difficult to", "problem is", "challenge is", "issue is"
        ],
        "discovery": [
            "what do you do", "how does this work", "tell me about",
            "explain your product", "what is", "what's this", "overview",
            "walk me through", "what exactly", "can you explain"
        ],
    }

    # Priority order: first match wins (higher priority first)
    STAGE_PRIORITY = [
        "closing",
        "negotiation",
        "objection_handling",
        "solution_framing",
        "problem_exploration",
        "discovery",
    ]

    def detect_stage(self, recent_messages: List[Dict[str, Any]]) -> str:
        """
        Takes the recent message buffer and returns the most relevant deal stage.
        Scans the last 3 prospect messages, weighted toward the most recent.
        Returns 'discovery' as the default stage.
        """
        # Gather the last 3 prospect messages (most recent first)
        prospect_msgs: List[str] = []
        for m in reversed(recent_messages):
            if m.get("speaker") == "prospect":
                prospect_msgs.append(m["text"].lower())
            if len(prospect_msgs) >= 3:
                break

        if not prospect_msgs:
            return "discovery"

        # Score each stage across all recent messages
        stage_scores: dict[str, float] = {stage: 0.0 for stage in self.STAGE_PRIORITY}

        for weight_idx, text in enumerate(prospect_msgs):
            # Most recent message has highest weight
            weight = 1.0 / (weight_idx + 1)
            for stage, keywords in self.STAGE_KEYWORDS.items():
                if any(kw in text for kw in keywords):
                    stage_scores[stage] += weight

        # Pick highest-scoring stage, respecting priority order as a tiebreaker
        best_stage = max(
            self.STAGE_PRIORITY,
            key=lambda s: (stage_scores[s], -self.STAGE_PRIORITY.index(s))
        )

        # If no keywords matched at all, default to discovery
        if stage_scores[best_stage] == 0.0:
            return "discovery"

        return best_stage


# Singleton instance
deal_stage_engine = DealStageEngine()
