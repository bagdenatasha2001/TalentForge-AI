from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from ai_service import call_openai_async, parse_json_response
import asyncio
import time

router = APIRouter()

class McqRequest(BaseModel):
    jd_text: str
    required_skills: Optional[str] = ""
    candidate_skills: Optional[str] = ""
    difficulty: Optional[str] = "ADAPTIVE"
    count: Optional[int] = 15
    topic_focus: Optional[str] = None
    previous_weak_areas: Optional[List[str]] = []
    user_id: Optional[int] = None

@router.post("/generate-mcq")
async def generate_mcq(request: McqRequest):
    start_time = time.time()
    count = min(request.count or 9, 15) # Default to 9 for speed
    batch_size = 3
    
    async def get_mcq_batch(n, b_id):
        prompt = f"""Generate {n} MCQs (Batch {b_id}) for JD:
{request.jd_text[:1000]}
FOCUS: {request.topic_focus or "General"}

RULES:
- One sentence explanation MAX.
- Return ONLY JSON with "questions" list containing: question_id, question_text, question_type, topic, skill_tag, difficulty, options (A,B,C,D), correct_answer, explanation, code_snippet.
"""
        raw = await call_openai_async(prompt)
        return parse_json_response(raw)

    try:
        num_batches = (count + batch_size - 1) // batch_size
        tasks = [get_mcq_batch(min(batch_size, count - i*batch_size), i+1) for i in range(num_batches)]
        results = await asyncio.gather(*tasks)

        
        all_questions = []
        all_topics = set()
        for res in results:
            if isinstance(res, dict) and "questions" in res:
                all_questions.extend(res["questions"])
            if isinstance(res, dict) and "topics_covered" in res:
                all_topics.update(res["topics_covered"])

        return {
            "questions": all_questions[:count],
            "total": len(all_questions),
            "topics_covered": list(all_topics),
            "latency_ms": int((time.time() - start_time) * 1000),
            "optimized": True
        }
    except Exception as e:
        return {"error": str(e), "questions": []}

