from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict
from ai_service import call_openai_async, parse_json_response

router = APIRouter()

class WeakDetectionRequest(BaseModel):
    topic_scores: Dict[str, float]  # {"Java": 45, "Spring Boot": 30, "SQL": 80}
    total_score: Optional[float] = 0.0
    jd_skills: Optional[List[str]] = []
    threshold: Optional[float] = 60.0
    user_id: Optional[int] = None

@router.post("/detect-weak")
async def detect_weak_areas(request: WeakDetectionRequest):
    weak_areas = [topic for topic, score in request.topic_scores.items()
                  if score < (request.threshold or 60.0)]

    strong_areas = [topic for topic, score in request.topic_scores.items()
                    if score >= (request.threshold or 60.0)]

    prompt = f"""You are ForgeAI Weak Area Detection Engine for TalentForge.

TOPIC SCORES: {request.topic_scores}
THRESHOLD: {request.threshold}%
JD REQUIRED SKILLS: {request.jd_skills}

Detected weak areas (below threshold): {weak_areas}
Strong areas: {strong_areas}

Analyze and provide intelligent reinforcement recommendations.

Return ONLY valid JSON:
{{
  "weak_areas": {weak_areas},
  "strong_areas": {strong_areas},
  "critical_gaps": ["most urgent skills to fix based on JD importance"],
  "improvement_priority": [
    {{
      "topic": "topic name",
      "current_score": 0.0,
      "target_score": 70.0,
      "priority": "HIGH|MEDIUM|LOW",
      "reason": "why this matters for the JD",
      "estimated_study_time": "2-3 hours"
    }}
  ],
  "overall_assessment": "2-3 sentence assessment of candidate readiness",
  "recommended_action": "REINFORCE|ADVANCE|READY"
}}"""

    try:
        raw = await call_openai_async(prompt)
        result = parse_json_response(raw)
        if not isinstance(result, dict):
            result = {}
        result["weak_areas"] = weak_areas
        result["strong_areas"] = strong_areas
        return result
    except Exception as e:
        return {
            "error": str(e),
            "weak_areas": weak_areas,
            "strong_areas": strong_areas,
            "recommended_action": "REINFORCE" if weak_areas else "ADVANCE"
        }
