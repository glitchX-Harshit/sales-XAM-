import os
import json
from openai import AsyncOpenAI

api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=api_key) if api_key else None

async def generate_response_suggestion(objection_type: str, transcript_context: list[dict]):
    """
    Takes a detected objection and the conversation context, returning a structured suggested response.
    """
    if not client:
        # Fallback mocks
        if objection_type == "pricing":
            return '{"strategy": "Value Over Price", "text": "Many clients start with our 5-seat plan and upgrade. Want to walk through the ROI?"}'
        elif objection_type == "competitor":
            return '{"strategy": "Differentiate", "text": "Salesforce is great for CRM, but we specialize in live AI coaching where they don\'t."}'
        elif objection_type == "timeline":
            return '{"strategy": "Low Implementation Effort", "text": "Setup takes 5 minutes and works alongside your current tools."}'
        return '{"strategy": "Acknowledge & Pivot", "text": "I hear you. Let\'s quickly address that..."}'

    prompt = f"""
    You are an expert sales AI assistant. The prospect just raised a "{objection_type}" objection.
    
    Recent Context:
    {json.dumps(transcript_context[-3:])}
    
    Generate a precise, high-converting response suggestion for the sales rep.
    Return ONLY a JSON object with:
    - "strategy": A short 3-word summary of the approach (e.g., "Value Over Cost")
    - "text": The actual words the rep should say (max 2 sentences).
    """

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        if "strategy" in data and "text" in data:
            return content
        return None
    except Exception as e:
        print(f"Suggestion generation error: {e}")
        return None
