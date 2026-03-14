import random
from collections import deque

class PersuasionEngine:
    def __init__(self):
        self.last_strategies = deque(maxlen=3)
        self.last_topic = None
        
        self.strategy_pools = {
            "pricing": [
                "ROI_REFRAMING",
                "COST_OF_INACTION",
                "SOCIAL_PROOF",
                "DIAGNOSTIC_QUESTION"
            ],
            "trust": [
                "SOCIAL_PROOF",
                "CASE_STORY",
                "RISK_REVERSAL"
            ],
            "authority": [
                "DECISION_DISCOVERY",
                "STAKEHOLDER_ALIGNMENT"
            ],
            "hesitation": [
                "COST_OF_INACTION",
                "FUTURE_PACING",
                "PILOT_OFFER"
            ],
            "interest": [
                "FUTURE_PACING",
                "VALUE_REFRAME"
            ]
        }
        
        self.all_strategies = list(set([strat for pool in self.strategy_pools.values() for strat in pool]))
        
    def select_strategy(self, topic: str) -> str:
        # Reset rotation if topic changes
        if topic != self.last_topic:
            self.last_strategies.clear()
            self.last_topic = topic
            
        topic_lower = topic.lower()
        
        # Get pool for topic, fallback to all strategies if topic not found
        pool = self.strategy_pools.get(topic_lower, self.all_strategies)
        
        # Remove recently used strategies from the pool
        available_strategies = [s for s in pool if s not in self.last_strategies]
        
        # If the filtered pool is empty, allow any strategy from the original pool (fallback)
        if not available_strategies:
            available_strategies = pool
            
        # Randomly select a strategy
        selected_strategy = random.choice(available_strategies)
        
        self.last_strategies.append(selected_strategy)
        
        return selected_strategy

# Singleton instance
persuasion_engine = PersuasionEngine()
