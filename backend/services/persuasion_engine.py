import random
from collections import deque

class PersuasionEngine:
    def __init__(self):
        self.last_strategies = deque(maxlen=3)
        self.last_topic = None
        
        self.strategy_pools = {
            "pricing": [
                "roi_reframing",
                "cost_of_inaction",
                "social_proof",
                "diagnostic_question"
            ],
            "trust": [
                "social_proof",
                "decision_control",
                "pilot_close"
            ],
            "authority": [
                "decision_control",
                "diagnostic_question"
            ],
            "hesitation": [
                "cost_of_inaction",
                "future_pacing",
                "pilot_close",
                "social_proof"
            ],
            "interest": [
                "future_pacing",
                "roi_reframing"
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
