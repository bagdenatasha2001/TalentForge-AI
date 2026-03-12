<h1 align="center">⚡ TalentForge AI</h1>
<p align="center">
  <b>AI-Powered Interview Preparation Platform · Powered by ForgeAI × Gemini</b><br/>
  <i>From Job Description to Interview-Ready — All in One Platform</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-green?style=for-the-badge&logo=spring" />
  <img src="https://img.shields.io/badge/Angular-18-red?style=for-the-badge&logo=angular" />
  <img src="https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-teal?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-purple?style=for-the-badge&logo=google" />
</p>

---

## 🚀 What is TalentForge AI?

**TalentForge AI** is a full-stack, AI-powered interview preparation platform that takes a **Job Description (JD)** as input and guides candidates through a complete, personalized preparation journey — from skill extraction to career roadmap generation.

The platform uses **Google Gemini** (via a Python FastAPI engine called **ForgeAI**) to power every step of the process.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📋 **JD Analysis** | Paste any JD — ForgeAI extracts skills, tools, and responsibilities |
| 🧠 **AI Learning Content** | Topic-based modules with explanations, examples, and interview tips |
| 📝 **Adaptive MCQ Test** | 10–20 questions that adjust difficulty based on performance |
| ⚠️ **Weak Area Detection** | AI identifies weak topics and generates targeted reinforcement |
| 🏆 **Readiness Score** | Weighted formula: MCQ×0.35 + Coding×0.30 + JD Match×0.20 + Learning×0.15 |
| 💼 **Career Insights** | AI-powered salary benchmarks, role recommendations, 30-day roadmap |
| 📄 **PDF Report** | Downloadable full performance report |
| 🛡️ **Admin Panel** | User management, AI interaction logs, platform analytics |
| 🔐 **Auth + OTP** | JWT-based auth with 5-step registration + Email OTP verification |

---

## 🖼️ UI

### 🏠 Dashboard & JD Upload

> Start your journey — upload a Job Description and let ForgeAI do the rest.

![Dashboard - Fresh Account](UI/38_Dashboard_FreshAccount_Readiness0_UploadJD_CTA.png)
![Dashboard - Preparation Flow (7 Steps)](UI/40_Dashboard_PreparationFlow_7Steps_AllPending.png)
![JD Analysis - Upload Form](UI/41_JD_Analysis_Upload_Paste_Form_AnalyzeButton.png)

---

### 🧠 ForgeAI Learning

> AI generates topic-based learning content tailored to your JD.

![ForgeAI Learning - Topic 1 OOP Expanded](UI/01_ForgeAI_Learning_Java_Developer_Topic1_OOP_Expanded.png)
![ForgeAI Learning - OOP Explanation & Real World Example](UI/02_ForgeAI_Learning_OOP_Explanation_RealWorld_Example.png)
![ForgeAI Learning - OOP Key Points, Interview Tip](UI/03_ForgeAI_Learning_OOP_KeyPoints_InterviewTip_MarkUnderstood.png)
![ForgeAI Learning - All 5 Topics Completed](UI/04_ForgeAI_Learning_All5Topics_Completed_TakeMCQPrompt.png)

---

### 📝 Adaptive MCQ Test

> A 10-20 question adaptive quiz based on your JD topics.

![MCQ Test - Start Screen](UI/05_MCQ_Test_Start_Screen_Adaptive_JDLoaded.png)
![MCQ Test - Question 1 (Core Java)](UI/06_MCQ_Test_Question1_Polymorphism_Easy.png)
![MCQ Test - Question 10 (SDLC)](UI/07_MCQ_Test_Question10_SDLC_Score4of9.png)
![MCQ Test - Results: 40%, Needs Improvement](UI/08_MCQ_Test_Results_40Percent_NeedsImprovement_TopicBreakdown.png)

---

### ⚠️ Weak Area Detection & Reinforcement

> ForgeAI identifies your weakest topics and generates targeted study material.

![Weak Areas - Detection Prompt](UI/09_Weak_Areas_Detection_Prompt_Screen.png)
![Weak Areas - 4 Weak, 2 Strong](UI/10_Weak_Areas_Results_4Weak_2Strong_ForgeAI_Assessment.png)
![Weak Areas - Priority List](UI/11_Weak_Areas_Priority_SDLC_DataPersistence_CoreJava.png)
![Weak Areas - Reinforcement Content](UI/12_Weak_Areas_Targeted_Reinforcement_Content_List.png)
![Weak Areas - Core Java Concepts](UI/13_Weak_Areas_CoreJava_CoreConcept_CommonMistakes.png)
![Weak Areas - Interview Tips & Code Example](UI/14_Weak_Areas_CoreJava_InterviewTips_CodeExample.png)
![Weak Areas - Practice Q&A](UI/15_Weak_Areas_CoreJava_Multithreading_PracticeQA.png)

---

### 🏆 Readiness Score

> Weighted formula gives you a final interview readiness score out of 100.

![Readiness Score - Calculator](UI/16_Readiness_Score_Calculator_Form_LivePreview14.png)
![Readiness Score - 14/100, NOT READY](UI/17_Readiness_Score_Result_14of100_NotReady_ScoreHistory.png)

**Score Levels:**
| Score | Level |
|-------|-------|
| 0–39 | 🔴 Not Ready |
| 40–59 | 🟡 Improving |
| 60–79 | 🟢 Interview Ready |
| 80–100 | 🔵 Highly Competitive |

---

### 💼 Career Insights

> AI-powered job role recommendations, salary benchmarks, and a personalized 30-day roadmap.

![Career Insights - Generate Prompt](UI/18_Career_Insights_Generate_Prompt_Screen.png)
![Career Insights - Market Demand & Salary](UI/19_Career_Insights_MediumDemand_Salary1.5to3.5LPA_TrendingSkills.png)
![Career Insights - Suitable Roles](UI/21_Career_Insights_3RoleCards_70_65_60Percent_30DayRoadmap.png)
![Career Insights - 30-Day Roadmap](UI/22_Career_Insights_30DayRoadmap_Week1_Week2_Week3.png)
![Career Insights - Skills & Certifications](UI/23_Career_Insights_Week4_SkillsToLearn_Certifications.png)
![Career Insights - ForgeAI Personal Advice](UI/24_Career_Insights_ForgeAI_PersonalAdvice_DownloadReport.png)

---

### 🔐 Auth — Login & Registration

> Secure JWT-based login with 5-step registration and email OTP verification.

![Login Page](UI/30_Login_Page_WithDemoCredentials_Candidate_Admin.png)
![Register - Step 1: Personal Details](UI/31_Register_Step1_PersonalDetails.png)
![Register - Step 2: Education](UI/32_Register_Step2_Education.png)
![Register - Step 3: Professional Details](UI/33_Register_Step3_ProfessionalDetails.png)
![Register - Step 4: Skills & Preferences](UI/34_Register_Step4_Skills_Preferences.png)
![Register - Step 5: Privacy & Consent](UI/36_Register_Step5_PrivacyConsent_Checked_CreateAccount.png)
![Email OTP Verification](UI/37_Verify_Email_OTP_Screen.png)

---

### 🛡️ Admin Panel

> Platform management dashboard — analytics, user management, and AI interaction logs.

![Admin Panel - Analytics](UI/26_Admin_Panel_Analytics_3Users_135AIInteractions_Online.png)
![Admin Panel - All Users](UI/27_Admin_Panel_Users_Tab_AllRegisteredUsers.png)
![Admin Panel - AI Logs](UI/28_Admin_Panel_AILogs_RecentCalls_AllOK.png)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 18, TypeScript, CSS |
| **Backend** | Java 21, Spring Boot 3, Maven |
| **AI Engine** | Python 3.11, FastAPI, Google Gemini API |
| **Databases** | PostgreSQL (users/scores), MongoDB (AI content/logs) |
| **Auth** | JWT + Email OTP (Gmail App Password) |
| **Containerization** | Docker, Docker Compose |

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java (JDK) | 21+ |
| Maven | 3.9+ |
| Python | 3.11+ |
| Node.js | 20+ |
| PostgreSQL | 15+ |
| MongoDB | 7+ |
| Docker (optional) | 24+ |

---

## 🚀 Quick Start

### Step 1 — Clone & Configure Environment

```bash
git clone https://github.com/your-username/TalentForge_AI.git
cd TalentForge_AI

# Copy environment template
cp .env.example .env
```

Edit `.env` and fill in:
- `AI_API_KEY` — Your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
- `JWT_SECRET` — Any random 64-char string
- `EMAIL_USERNAME` — Your Gmail address
- `EMAIL_APP_PASSWORD` — 16-char App Password from [Google Account Security](https://myaccount.google.com/apppasswords)

---

### Step 2 — Setup Databases

**PostgreSQL:**
```sql
CREATE DATABASE talentforge;
CREATE USER talentforge WITH PASSWORD 'talentforge123';
GRANT ALL PRIVILEGES ON DATABASE talentforge TO talentforge;
```

**MongoDB:** No setup needed — collections are created automatically.

---

### Step 3 — Start Python AI Engine

```bash
cd ai-engine

# Create & activate virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Create & activate virtual environment (Mac/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the AI engine
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

✅ AI Engine: `http://localhost:8000`
📖 API Docs: `http://localhost:8000/docs`

---

### Step 4 — Start Spring Boot Backend

```bash
cd backend

# Set environment variables (PowerShell)
$env:JWT_SECRET="your_jwt_secret"
$env:EMAIL_USERNAME="your@gmail.com"
$env:EMAIL_APP_PASSWORD="your_app_password"

# Build and run
mvn spring-boot:run
```

✅ Backend: `http://localhost:8080`

> Spring Boot will auto-create all PostgreSQL tables and seed 2 demo accounts.

---

### Step 5 — Start Angular Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend: `http://localhost:4200`

---

### 🐳 Option B: Docker Compose (All at Once)

```bash
# From root directory (make sure .env is configured first)
docker-compose up --build
```

Starts all 5 services: PostgreSQL · MongoDB · AI Engine · Backend · Frontend

---

## 🔑 Demo Credentials

| Role | Username / Email | Password |
|------|-----------------|----------|
| 👤 Candidate | `demo@talentforge.ai` | `Demo@1234` |
| 🛡️ Admin | `TalentForgeAI` | `ForgeAI@1412` |

---

## 🗺️ Platform Flow (14-Step Journey)

```
1.  Register (5-step form) → Email OTP Verification
2.  Login
3.  Dashboard
4.  JD Upload → ForgeAI Skill Extraction
5.  ForgeAI Learning  (10 Q/set × up to 10 sets = 100 per JD)
6.  Adaptive MCQ Test (10–20 questions, auto-adjusting difficulty)
7.  Weak Area Detection → ForgeAI Priority Analysis
8.  Targeted Reinforcement (Core Concepts + Practice Q&A + Code Examples)
9.  Re-Test on Weak Areas
10. Readiness Score Calculation
      Formula: (MCQ×0.35) + (Coding×0.30) + (JD Match×0.20) + (Learning×0.15)
11. Level Classification: Not Ready / Improving / Interview Ready / Highly Competitive
12. Career Insights (Roles, Salary, Market Demand, 30-Day Roadmap)
13. PDF Report Download
14. Admin Panel (User Management, AI Logs, Analytics)
```

---

## 📡 API Reference

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/verify-otp` | Verify OTP and activate account |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Login → returns JWT |

### Candidate (JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jd/analyze` | Upload and analyze JD |
| POST | `/api/learning/generate-questions` | Generate learning questions |
| POST | `/api/learning/generate-mcq` | Generate adaptive MCQ |
| POST | `/api/learning/detect-weak` | Detect weak areas |
| POST | `/api/learning/reinforce` | Get reinforcement content |
| POST | `/api/readiness/calculate` | Calculate readiness score |
| POST | `/api/readiness/career-insights` | Get career insights |
| GET | `/api/pdf/report` | Download PDF report |

### Admin (ADMIN Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET | `/api/admin/ai-logs` | View AI interaction logs |
| GET | `/api/admin/analytics` | Platform analytics |

### ForgeAI Engine (Internal — Port 8000)
| Endpoint | Description |
|----------|-------------|
| POST `/api/ai/extract-skills` | JD skill extraction |
| POST `/api/ai/generate-questions` | Interview Q generation |
| POST `/api/ai/generate-mcq` | Adaptive MCQ |
| POST `/api/ai/detect-weak` | Weak area detection |
| POST `/api/ai/reinforce` | Reinforcement content |
| POST `/api/ai/career-insights` | Career recommendations |

---

## 🐛 Troubleshooting

**Backend won't start — DB connection error:**
Ensure PostgreSQL and MongoDB are running and credentials in `application.yml` match.

**AI Engine returns 401/403:**
Check `AI_API_KEY` in `ai-engine/.env`. Verify key at [Google AI Studio](https://aistudio.google.com/apikey).

**Email OTP not received:**
Ensure Gmail 2FA is ON and you're using an **App Password**, not your login password. Check spam folder.

**Angular 4200 proxy not working:**
Ensure `proxy.conf.json` routes `/api` → `http://localhost:8080`. Use `npm start` (not `ng serve`).

---

## 📁 Project Structure

```
TalentForge_AI/
├── ai-engine/          # Python FastAPI — ForgeAI engine (Gemini)
│   ├── main.py
│   ├── routers/
│   └── requirements.txt
├── backend/            # Java Spring Boot — REST API + auth + DB
│   ├── src/
│   └── pom.xml
├── frontend/           # Angular 18 — UI
│   ├── src/
│   └── package.json
├── UI/                 # 41 UI screenshots (numbered & named)
├── .env.example        # Environment variable template
├── .gitignore
├── Commands.txt        # Quick-start commands reference
├── SETUP_GUIDE.md      # Detailed setup documentation
└── README.md
```

---

<p align="center">
  Built with ❤️ using Spring Boot · FastAPI · Angular · Google Gemini<br/>
  <b>TalentForge AI</b> — Where Preparation Meets Intelligence
</p>
