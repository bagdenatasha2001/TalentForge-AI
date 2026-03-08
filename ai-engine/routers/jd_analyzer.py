from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ai_service import call_openai_async, parse_json_response
import json

router = APIRouter()

class JdAnalysisRequest(BaseModel):
    jd_text: str
    job_title: Optional[str] = ""

@router.post("/extract-skills")
async def extract_skills(request: JdAnalysisRequest):
    prompt = f"""Extract structured data from this JD:
{request.jd_text[:3000]}

Return JSON:
{{
  "job_title": "title",
  "required_skills": ["s1", "s2"],
  "required_tools": ["t1"],
  "core_responsibilities": ["r1"],
  "experience_level": "Junior/Mid/Senior",
  "soft_skills": ["ss1"],
  "skill_match_score": 80.0,
  "responsibility_match_score": 80.0,
  "key_technologies": ["tech1"],
  "industry_domain": "domain"
}}"""

    try:
        raw = await call_openai_async(prompt, json_mode=True)
        return parse_json_response(raw)
    except Exception as e:

        return {
            "error": str(e),
            "job_title": request.job_title,
            "required_skills": [],
            "required_tools": [],
            "core_responsibilities": [],
            "experience_level": "Mid",
            "soft_skills": [],
            "skill_match_score": 0.0,
            "responsibility_match_score": 0.0
        }
