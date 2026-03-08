from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from ai_service import call_openai_async, parse_json_response
import asyncio
import json
import time

router = APIRouter()

class LearningContentRequest(BaseModel):
    jd_text: str
    job_title: Optional[str] = ""
    required_skills: Optional[str] = ""
    jd_record_id: Optional[int] = None
    user_id: Optional[int] = None

@router.post("/generate-content")
async def generate_learning_content(request: LearningContentRequest):
    """Generate topic-based learning content with explanations and examples."""
    prompt = f"""You are ForgeAI Learning Engine. Generate exactly 5 learning topics for this job.

JOB TITLE: {request.job_title}
KEY SKILLS: {request.required_skills}
JD SUMMARY: {request.jd_text[:800]}

Return ONLY this valid JSON (no extra text, no markdown):
{{"job_title":"{request.job_title}","topics":[{{"id":1,"name":"Topic","category":"Core Concept","explanation":"2-3 sentence explanation.","why_it_matters":"Why important for this role.","real_world_example":"One concrete example.","second_example":"","key_points":["Point 1","Point 2","Point 3"],"interview_tip":"One interview tip.","difficulty":"Intermediate"}}]}}

Generate exactly 5 real topics relevant to {request.job_title}. Keep each field concise (1-3 sentences max). Return raw JSON only."""

    try:
        raw = await call_openai_async(prompt, json_mode=True)
        print(f"[generate-content] Raw response (first 300): {raw[:300]}")
        result = parse_json_response(raw)
        
        # If no topics AND no error — the JSON parsing failed; surface raw for debugging
        if not result.get("topics") and not result.get("error"):
            print(f"[generate-content] Parsed result has no topics: {result}")
            return {"error": f"Gemini response could not be parsed. First 200 chars: {raw[:200]}", "topics": []}
        
        return result
    except Exception as e:
        return {"error": str(e), "topics": []}

class GenerateQuestionsRequest(BaseModel):
    jd_text: str
    required_skills: Optional[str] = ""
    core_responsibilities: Optional[str] = ""
    candidate_skills: Optional[str] = ""
    candidate_role: Optional[str] = ""
    question_type: Optional[str] = "MIXED"  # TECHNICAL, SCENARIO, HR, CODING, MIXED
    count: Optional[int] = 10
    user_id: Optional[int] = None
    jd_record_id: Optional[int] = None
    exclude_questions: Optional[List[str]] = []

class InterrogationRequest(BaseModel):
    question_text: str
    candidate_answer: Optional[str] = ""
    skill_tag: Optional[str] = ""
    jd_text: Optional[str] = ""
    candidate_skills: Optional[str] = ""
    candidate_role: Optional[str] = ""
    user_id: Optional[int] = None

@router.post("/generate-questions")
async def generate_questions(request: GenerateQuestionsRequest):
    start_time = time.time()
    count = min(request.count or 6, 10) # Default to 6 for speed
    batch_size = 3
    
    async def get_batch(n, batch_id):
        exclude_str = ""
        if request.exclude_questions:
            exclude_items = "\n- ".join(request.exclude_questions)
            exclude_str = f"\nDO NOT REPEAT THESE QUESTIONS:\n- {exclude_items}\n"

        batch_prompt = f"""Generate {n} interview questions (Batch {batch_id}) for this JD:
{request.jd_text[:1000]}
TYPE: {request.question_type}{exclude_str}

RULES:
- Answers MUST be 1-2 sentences max.
- Coding solutions MUST be short.
- Return ONLY JSON with "questions" list containing: question_text, question_type, difficulty, skill_tag, responsibility_mapping, interview_style_answer, developer_style_answer, explanation, key_points, coding_solution.
"""
        raw = await call_openai_async(batch_prompt)
        return parse_json_response(raw)

    try:
        num_batches = (count + batch_size - 1) // batch_size
        tasks = [get_batch(min(batch_size, count - i*batch_size), i+1) for i in range(num_batches)]
        results = await asyncio.gather(*tasks)

        
        all_questions = []
        all_skills = set()
        for res in results:
            if isinstance(res, dict) and "questions" in res:
                all_questions.extend(res["questions"])
            if isinstance(res, dict) and "skill_coverage" in res:
                all_skills.update(res["skill_coverage"])

        return {
            "questions": all_questions[:count],
            "total_generated": len(all_questions),
            "skill_coverage": list(all_skills),
            "latency_ms": int((time.time() - start_time) * 1000),
            "optimized": True
        }
    except Exception as e:
        return {"error": str(e), "questions": []}


@router.post("/interrogate")
async def generate_interrogation(request: InterrogationRequest):
    prompt = f"""You are ForgeAI Interrogation Engine — a strict, panel-style AI interviewer for TalentForge.

The candidate opted into strict interrogation for this question. Generate a challenging interrogation set.

ORIGINAL QUESTION: {request.question_text}
CANDIDATE'S ANSWER: {request.candidate_answer or "Not provided"}
SKILL TAG: {request.skill_tag}
JD CONTEXT: {request.jd_text}
CANDIDATE CLAIMED SKILLS: {request.candidate_skills}

INTERROGATION RULES:
- Ask implementation-level follow-ups
- If skill claimed → Ask "HOW exactly did you implement it?"
- Challenge vague answers
- Cross-verify claimed experience
- Compare with JD expectations
- Be professional but demanding

Return ONLY valid JSON:
{{
  "interrogation_question": "Follow-up question challenging their answer",
  "deep_counter_question": "Deeper technical challenge question",
  "cross_verification_trap": "A question that exposes if they truly know the topic",
  "model_answer": "Expected expert-level answer the candidate should give",
  "evaluation_notes": "What a strong vs weak answer looks like",
  "difficulty_level": "CHALLENGING|ADVANCED|EXPERT",
  "areas_probed": ["area1", "area2"]
}}"""

    try:
        raw = await call_openai_async(prompt)
        result = parse_json_response(raw)
        return result
    except Exception as e:
        return {"error": str(e)}

@router.post("/reinforce")
async def generate_reinforcement(request: dict):
    start_time = time.time()
    weak_topics = request.get("weak_topics", [])
    jd_text = request.get("jd_text", "")
    candidate_skills = request.get("candidate_skills", "")

    async def get_topic_module(topic):
        prompt = f"""You are ForgeAI Reinforcement Engine. Generate targeted reinforcement for: {topic}
Context: {jd_text[:1000]}
Skills: {candidate_skills}

Return ONLY JSON with the structure:
{{
  "topic": "{topic}",
  "core_concept": "explanation...",
  "common_mistakes": ["mistake1"],
  "interview_tips": ["tip1"],
  "practice_questions": [{{ "question": "q", "answer": "a" }}],
  "code_example": "snippet",
  "resources": ["res1"]
}}"""
        raw = await call_openai_async(prompt)
        return parse_json_response(raw)

    try:
        tasks = [get_topic_module(t) for t in weak_topics[:5]] # Max 5 topics for speed
        results = await asyncio.gather(*tasks)
        
        return {
            "reinforcement_modules": results,
            "latency_ms": int((time.time() - start_time) * 1000),
            "optimized": True
        }
    except Exception as e:
        return {"error": str(e), "reinforcement_modules": []}

