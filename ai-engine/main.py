from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from routers import jd_analyzer, learning_engine, mcq_generator, weak_detector, career_insights

app = FastAPI(
    title="TalentForge ForgeAI Engine",
    description="AI-powered interview preparation engine powered by Gemini",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(jd_analyzer.router, prefix="/api/ai", tags=["JD Analysis"])
app.include_router(learning_engine.router, prefix="/api/ai", tags=["Learning Engine"])
app.include_router(mcq_generator.router, prefix="/api/ai", tags=["MCQ Engine"])
app.include_router(weak_detector.router, prefix="/api/ai", tags=["Weak Detection"])
app.include_router(career_insights.router, prefix="/api/ai", tags=["Career Insights"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "TalentForge ForgeAI Engine", "model": "gemini-2.0-flash"}

@app.get("/")
async def root():
    return {"message": "⚡ TalentForge ForgeAI Engine — Powered by Gemini", "docs": "/docs"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
