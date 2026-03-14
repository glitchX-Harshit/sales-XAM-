import uuid

class CallContextEngine:
    def __init__(self):
        self.sessions = {}

    def create_context(self, client_name: str, client_industry: str, client_role: str, product_name: str, call_goal: str) -> str:
        context_id = str(uuid.uuid4())
        self.sessions[context_id] = {
            "client_name": client_name,
            "client_industry": client_industry,
            "client_role": client_role,
            "product_name": product_name,
            "call_goal": call_goal
        }
        return context_id

    def get_context(self, context_id: str) -> dict | None:
        return self.sessions.get(context_id)

call_context_engine = CallContextEngine()
