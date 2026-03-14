from difflib import SequenceMatcher

class SuggestionManager:
    def __init__(self, max_history=10, similarity_threshold=0.75):
        self.history = []
        self.max_history = max_history
        self.similarity_threshold = similarity_threshold

    def is_duplicate(self, text: str) -> bool:
        """
        Check if the newly suggested response is too similar to any recent suggestions.
        """
        if not text:
            return False
            
        text_lower = text.lower()
        for past_sugg in self.history:
            ratio = SequenceMatcher(None, text_lower, past_sugg.lower()).ratio()
            if ratio >= self.similarity_threshold:
                return True
                
        return False

    def add_suggestion(self, text: str):
        """
        Add a suggestion to the history, respecting the max_history limit.
        """
        if not text:
            return
            
        self.history.append(text)
        if len(self.history) > self.max_history:
            self.history.pop(0)

suggestion_manager = SuggestionManager()
