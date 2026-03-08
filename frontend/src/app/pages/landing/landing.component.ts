import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="landing">
      <!-- Animated Background -->
      <div class="bg-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <!-- Navbar -->
      <nav class="nav">
        <div class="nav-logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">TALENTFORGE</span>
        </div>
        <div class="nav-links">
          <a routerLink="/login" class="tf-btn tf-btn-ghost tf-btn-sm">Login</a>
          <a routerLink="/register" class="tf-btn tf-btn-primary tf-btn-sm">Get Started</a>
        </div>
      </nav>

      <!-- Hero -->
      <section class="hero">
        <div class="hero-badge tf-badge tf-badge-primary tf-mb-4">
          <span>⚡</span> Powered by ForgeAI × Gemini
        </div>
        <h1 class="hero-title">
          Land Your Dream Job
          <span class="tf-gradient-text block">Interview-Ready.</span>
        </h1>
        <p class="hero-subtitle">
          TalentForge's AI engine analyzes real job descriptions, generates personalized questions,
          detects your weak areas, and trains you until you're truly interview-ready.
        </p>
        <div class="hero-actions">
          <a routerLink="/register" class="tf-btn tf-btn-primary tf-btn-lg">
            🚀 Start Preparation Free
          </a>
          <a routerLink="/login" class="tf-btn tf-btn-outline tf-btn-lg">
            Demo Login →
          </a>
        </div>

        <!-- Stats Bar -->
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-num tf-gradient-text">100+</span>
            <span class="stat-label">Questions per JD</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num tf-gradient-text">ForgeAI</span>
            <span class="stat-label">AI Interrogation Mode</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num tf-gradient-text">4-Phase</span>
            <span class="stat-label">Readiness Loop</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num tf-gradient-text">PDF</span>
            <span class="stat-label">Readiness Report</span>
          </div>
        </div>
      </section>

      <!-- Flow Section -->
      <section class="flow-section">
        <h2 class="section-title">How TalentForge Works</h2>
        <p class="section-subtitle">A continuous AI preparation loop — not a quiz app</p>
        <div class="flow-grid">
          <div *ngFor="let step of flowSteps" class="flow-card tf-card">
            <div class="flow-num">{{ step.num }}</div>
            <div class="flow-icon">{{ step.icon }}</div>
            <h3 class="flow-title">{{ step.title }}</h3>
            <p class="flow-desc">{{ step.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features-section">
        <h2 class="section-title">Platform Capabilities</h2>
        <div class="features-grid">
          <div *ngFor="let f of features" class="feature-card tf-card">
            <div class="feature-icon">{{ f.icon }}</div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Demo Credentials -->
      <section class="demo-section">
        <div class="demo-card tf-card tf-card-glow">
          <div class="demo-header">
            <span>🎯</span>
            <h3>Try It Instantly — Demo Credentials</h3>
          </div>
          <div class="demo-accounts">
            <div class="demo-account">
              <div class="demo-role tf-badge tf-badge-primary">👤 CANDIDATE</div>
              <div class="demo-creds">
                <code>demo&#64;talentforge.ai</code>
                <code>Demo&#64;1234</code>
              </div>
            </div>
            <div class="demo-account">
              <div class="demo-role tf-badge tf-badge-purple">🛡️ ADMIN</div>
              <div class="demo-creds">
                <code>TalentForgeAI</code>
                <code>ForgeAI&#64;1412</code>
              </div>
            </div>
          </div>
          <a routerLink="/login" class="tf-btn tf-btn-primary tf-btn-full">
            Login with Demo Account →
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-logo">⚡ TALENTFORGE</div>
        <p class="footer-text">AI Interview Preparation Platform — Powered by ForgeAI</p>
        <p class="footer-copy">© 2024 TalentForge. All rights reserved.</p>
      </footer>
    </div>
  `,
    styles: [`
    .landing {
      min-height: 100vh;
      background: var(--tf-bg);
      position: relative;
      overflow-x: hidden;
    }
    .bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
      animation: float 6s ease-in-out infinite;
    }
    .orb-1 { width: 500px; height: 500px; background: #00d4ff; top: -200px; left: -100px; }
    .orb-2 { width: 400px; height: 400px; background: #0066ff; top: 40vh; right: -100px; animation-delay: -2s; }
    .orb-3 { width: 300px; height: 300px; background: #a855f7; bottom: 10vh; left: 30%; animation-delay: -4s; }

    .nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 60px;
      position: sticky; top: 0; z-index: 100;
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--tf-border);
      background: rgba(7, 7, 26, 0.8);
    }
    .nav-logo { display: flex; align-items: center; gap: 10px; }
    .logo-icon { font-size: 22px; }
    .logo-text { font-size: 20px; font-weight: 900; letter-spacing: 3px; background: var(--tf-grad-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .nav-links { display: flex; gap: 12px; }

    .hero {
      max-width: 900px; margin: 0 auto;
      padding: 100px 40px 60px;
      text-align: center;
      position: relative; z-index: 1;
    }
    .hero-title {
      font-size: clamp(42px, 6vw, 72px);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -2px;
      margin-bottom: 24px;
    }
    .block { display: block; }
    .hero-subtitle {
      font-size: 18px; color: var(--tf-text-secondary);
      max-width: 600px; margin: 0 auto 40px;
      line-height: 1.7;
    }
    .hero-actions { display: flex; gap: 16px; justify-content: center; margin-bottom: 60px; flex-wrap: wrap; }

    .stats-bar {
      display: flex; align-items: center; justify-content: center;
      gap: 0;
      background: var(--tf-card);
      border: 1px solid var(--tf-border);
      border-radius: var(--tf-radius);
      padding: 24px 40px;
      flex-wrap: wrap;
    }
    .stat-item { text-align: center; padding: 0 32px; }
    .stat-num { font-size: 26px; font-weight: 900; display: block; }
    .stat-label { font-size: 12px; color: var(--tf-text-secondary); }
    .stat-divider { width: 1px; height: 40px; background: var(--tf-border); }

    .flow-section, .features-section, .demo-section {
      max-width: 1200px; margin: 0 auto;
      padding: 80px 40px;
      position: relative; z-index: 1;
    }
    .section-title { font-size: 36px; font-weight: 800; text-align: center; margin-bottom: 12px; }
    .section-subtitle { text-align: center; color: var(--tf-text-secondary); margin-bottom: 48px; font-size: 16px; }

    .flow-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }
    .flow-card { text-align: center; position: relative; }
    .flow-num {
      font-size: 11px; font-weight: 700;
      color: var(--tf-primary); letter-spacing: 2px; text-transform: uppercase;
      border: 1px solid var(--tf-border-glow); display: inline-block;
      padding: 3px 10px; border-radius: 20px; margin-bottom: 12px;
    }
    .flow-icon { font-size: 32px; margin-bottom: 12px; }
    .flow-title { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
    .flow-desc { font-size: 13px; color: var(--tf-text-secondary); line-height: 1.6; }

    .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .feature-card { padding: 28px; }
    .feature-icon { font-size: 36px; margin-bottom: 16px; }
    .feature-title { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
    .feature-desc { font-size: 14px; color: var(--tf-text-secondary); line-height: 1.7; }

    .demo-section { max-width: 600px; }
    .demo-card { text-align: center; padding: 36px; }
    .demo-header { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; }
    .demo-header h3 { font-size: 18px; font-weight: 700; }
    .demo-accounts { display: flex; gap: 20px; justify-content: center; margin-bottom: 24px; flex-wrap: wrap; }
    .demo-account { text-align: left; }
    .demo-role { margin-bottom: 10px; }
    .demo-creds { display: flex; flex-direction: column; gap: 6px; }
    code {
      background: rgba(0, 212, 255, 0.08);
      border: 1px solid var(--tf-border-glow);
      color: var(--tf-primary);
      padding: 5px 12px; border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
    }

    .footer { text-align: center; padding: 40px; border-top: 1px solid var(--tf-border); position: relative; z-index: 1; }
    .footer-logo { font-size: 18px; font-weight: 900; letter-spacing: 3px; background: var(--tf-grad-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px; }
    .footer-text { color: var(--tf-text-secondary); font-size: 14px; margin-bottom: 6px; }
    .footer-copy { color: var(--tf-text-muted); font-size: 12px; }
  `]
})
export class LandingComponent {
    flowSteps = [
        { num: '01', icon: '📄', title: 'Upload JD', desc: 'Paste or upload any job description and let ForgeAI extract all key requirements.' },
        { num: '02', icon: '🧠', title: 'AI Skill Extraction', desc: 'Skills, tools, responsibilities, and experience level extracted in seconds.' },
        { num: '03', icon: '📚', title: 'Learn with ForgeAI', desc: 'Get 100 JD-specific questions with interview-style answers, explanations, and code examples.' },
        { num: '04', icon: '🔍', title: 'Strict Interrogation', desc: 'Opt into panel-style interrogation per question. ForgeAI challenges you with counter-questions.' },
        { num: '05', icon: '📝', title: 'Adaptive MCQ Test', desc: 'Concept, Scenario & Coding MCQs that adapt difficulty based on your performance.' },
        { num: '06', icon: '⚠️', title: 'Weak Area Detection', desc: 'AI pinpoints exact topics where you scored below threshold with priority ranking.' },
        { num: '07', icon: '🔄', title: 'Reinforcement Loop', desc: 'Targeted revision, focused questions, and re-testing until improvement is detected.' },
        { num: '08', icon: '🏆', title: 'Readiness Score', desc: 'Final score computed with MCQ×0.35 + Coding×0.30 + JDMatch×0.20 + Learning×0.15.' },
        { num: '09', icon: '💼', title: 'Career Insights', desc: 'Suitable roles, salary ranges, market demand, and a 30-day roadmap tailored to you.' },
        { num: '10', icon: '📊', title: 'PDF Report', desc: 'Download your complete readiness report with skill breakdown and career suggestions.' },
    ];

    features = [
        { icon: '🤖', title: 'ForgeAI Learning Engine', desc: 'Generates 10 questions per set (max 100 per JD), each with Interview-style & Developer-style answers, key points, and code.' },
        { icon: '🔎', title: 'Strict Interrogation Mode', desc: 'Optional per-question interrogation with deep counter-questions, cross-verification traps, and model answers.' },
        { icon: '📈', title: 'Adaptive Difficulty', desc: 'MCQ difficulty auto-adjusts: increases if you\'re performing well, reinforces basics when you struggle.' },
        { icon: '🎯', title: 'JD-Specific Content', desc: 'Everything is generated based on the exact job description. No generic content ever.' },
        { icon: '💬', title: '4-Type Questions', desc: 'Technical, Scenario-based, HR, and Coding questions mapped to JD responsibilities and skill tags.' },
        { icon: '🛡️', title: 'Admin Control Panel', desc: 'Full admin dashboard with user management, AI interaction logs, analytics, and system monitoring.' },
    ];
}
