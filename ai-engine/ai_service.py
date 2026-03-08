import google.generativeai as genai
import json
import re
import asyncio
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

# gemini-2.5-flash confirmed working with current API key
MODEL_NAME = "gemini-2.5-flash"

def get_model():
    config = {
        "temperature": 0.1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 4096,
    }
    return genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=config
    )

async def call_gemini_async(prompt: str, retries: int = 5, json_mode: bool = True) -> str:
    """Async call Gemini API with retry logic. Returns text string."""
    model = get_model()
    
    # Append JSON instruction to prompt if json_mode
    full_prompt = prompt
    if json_mode:
        full_prompt = prompt + "\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no explanation, just the raw JSON."
    
    # Progressive backoff: longer waits for rate limits (Gemini resets every 30s on free tier)
    backoff_times = [5, 15, 30, 45, 60]
    
    for attempt in range(retries):
        try:
            response = await asyncio.to_thread(model.generate_content, full_prompt)
            return response.text
        except Exception as e:
            err_str = str(e)
            is_rate_limit = "429" in err_str or "quota" in err_str.lower() or "rate" in err_str.lower()
            
            if attempt == retries - 1:
                return json.dumps({"error": err_str})
            
            # Use longer backoff for rate limits so Gemini's 30s window can reset
            wait_time = backoff_times[attempt] if is_rate_limit else (1.5 ** attempt)
            print(f"[AI] Attempt {attempt + 1}/{retries} failed ({'rate limit' if is_rate_limit else 'error'}). "
                  f"Waiting {wait_time}s before retry...")
            await asyncio.sleep(wait_time)
    return "{}"

# Alias for OpenAI-compatible interface used in routers
async def call_openai_async(prompt: str, system_prompt: str = "", retries: int = 3, json_mode: bool = True) -> str:
    """Wrapper to maintain compatibility with OpenAI-style calls."""
    return await call_gemini_async(prompt, retries=retries, json_mode=json_mode)

def parse_json_response(text: str) -> dict | list:
    """Extract and parse JSON from Gemini response."""
    if not text or text.strip() == "":
        return {}

    # Remove common markdown wrappers
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r'^```(?:json)?\n?', '', text)
        text = re.sub(r'\n?```$', '', text)
        text = text.strip()

    # Direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting JSON block
    patterns = [
        r'```json\s*([\s\S]*?)\s*```',
        r'```\s*([\s\S]*?)\s*```',
        r'\{[\s\S]*\}',
        r'\[[\s\S]*\]',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.DOTALL)
        if match:
            try:
                content = match.group(1) if '```' in pattern else match.group(0)
                return json.loads(content.strip())
            except json.JSONDecodeError:
                continue

    return {"raw_response": text}
