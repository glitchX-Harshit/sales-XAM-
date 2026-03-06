import os
import json
from openai import AsyncOpenAI

api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=api_key) if api_key else None

async def detect_objection(transcript_context: list[dict]):
    """
    Analyzes the recent transcript to detect potential sales objections.
    Returns JSON string with objection type and confidence if one is found.
    """
    if not client:
        # Mock behavior for testing if no API key is present
        text = " ".join([m["text"] for m in transcript_context[-3:]]).lower()
        if "expensive" in text or "budget" in text or "price" in text:
             return '{"type": "pricing", "confidence": 0.92}'
        if "competitor" in text or "salesforce" in text:
             return '{"type": "competitor", "confidence": 0.88}'
        if "time" in text or "bandwidth" in text or "now" in text:
             return '{"type": "timeline", "confidence": 0.85}'
        return None

    # Use GPT-4o-mini (or GPT-3.5) for fast inference
    prompt = f"""
    You are a real-time sales coach AI. Analyze the following recent conversation snippet and determine if the prospect raised a sales objection.
    
    Conversation:
    {json.dumps(transcript_context)}
    
    If there is an objection, respond ONLY with a JSON object containing "type" (one of: pricing, competitor, timeline, trust, feature, security) and "confidence" (float between 0.0 and 1.0).
    If there is no objection, respond with an empty JSON object: {{}}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        if "type" in data and "confidence" in data:
            return content
        return None
    except Exception as e:
        print(f"Objection detection error: {e}")
        return None
