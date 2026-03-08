from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from ai_service import call_openai_async, parse_json_response

router = APIRouter()

class CareerInsightsRequest(BaseModel):
    final_score: Optional[float] = 0.0
    readiness_level: Optional[str] = "IMPROVING"
    jd_text: Optional[str] = ""
    required_skills: Optional[List[str]] = []
    current_role: Optional[str] = ""
    technical_skills: Optional[str] = ""
    preferred_role: Optional[str] = ""
    years_experience: Optional[float] = 0.0
    user_id: Optional[int] = None

@router.post("/career-insights")
async def generate_career_insights(request: CareerInsightsRequest):
    prompt = f"""You are ForgeAI Career Intelligence Engine for TalentForge.

Generate comprehensive career insights for this candidate.

CANDIDATE PROFILE:
- Current Role: {request.current_role}
- Years of Experience: {request.years_experience}
- Technical Skills: {request.technical_skills}
- Preferred Role: {request.preferred_role}
- Readiness Score: {request.final_score}/100 ({request.readiness_level})
- JD Context: {request.jd_text[:500] if request.jd_text else ""}
- Required Skills from JD: {request.required_skills}

Based on this profile and their readiness score, provide:
1. Suitable job roles they can target NOW
2. Realistic salary ranges (Indian market)
3. Specific 30-day improvement roadmap
4. Market demand insights

Return ONLY valid JSON:
{{
  "suitable_roles": [
    {{
      "title": "role title",
      "match_percentage": 85,
      "reason": "why they are suitable",
      "salary_range": "₹X-Y LPA",
      "companies": ["company1", "company2"]
    }}
  ],
  "salary_insights": {{
    "current_market_range": "₹X-Y LPA",
    "expected_with_skills": "₹X-Y LPA",
    "top_paying_companies": ["company1", "company2"]
  }},
  "market_demand": {{
    "demand_level": "HIGH|MEDIUM|LOW",
    "trending_skills": ["skill1", "skill2"],
    "market_insight": "2-3 sentences about current market"
  }},
  "thirty_day_roadmap": [
    {{
      "week": "Week 1",
      "focus": "focus area",
      "daily_tasks": ["task1", "task2", "task3"],
      "goal": "what to achieve by end of week"
    }},
    {{
      "week": "Week 2",
      "focus": "focus area",
      "daily_tasks": ["task1", "task2"],
      "goal": "what to achieve by end of week"
    }},
    {{
      "week": "Week 3",
      "focus": "focus area",
      "daily_tasks": ["task1", "task2"],
      "goal": "what to achieve by end of week"
    }},
    {{
      "week": "Week 4",
      "focus": "focus area",
      "daily_tasks": ["task1", "task2"],
      "goal": "Interview readiness goal"
    }}
  ],
  "skill_recommendations": ["skill to learn 1", "skill to learn 2"],
  "certification_suggestions": ["cert1", "cert2"],
  "overall_advice": "2-3 sentence personalized career advice"
}}"""

    try:
        raw = await call_openai_async(prompt)
        result = parse_json_response(raw)
        return result
    except Exception as e:
        return {"error": str(e), "suitable_roles": [], "thirty_day_roadmap": []}
