import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-career-insights',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="tf-page">
      <nav class="tf-sidebar">
        <div class="tf-sidebar-logo"><div class="logo-text">⚡ TALENTFORGE</div></div>
        <div class="tf-sidebar-content">
          <a class="tf-nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span> Dashboard</a>
          <a class="tf-nav-item" routerLink="/jd-upload"><span class="nav-icon">📄</span> JD Analysis</a>
          <a class="tf-nav-item" routerLink="/learning"><span class="nav-icon">🧠</span> ForgeAI Learning</a>
          <a class="tf-nav-item" routerLink="/mcq-test"><span class="nav-icon">📝</span> MCQ Test</a>
          <a class="tf-nav-item" routerLink="/weak-areas"><span class="nav-icon">⚠️</span> Weak Areas</a>
          <a class="tf-nav-item" routerLink="/readiness"><span class="nav-icon">🏆</span> Readiness</a>
          <a class="tf-nav-item active" routerLink="/career-insights"><span class="nav-icon">💼</span> Career</a>
          <a class="tf-nav-item" routerLink="/report"><span class="nav-icon">📊</span> Report</a>
        </div>
      </nav>

      <main class="tf-main with-sidebar">
        <div class="tf-page-header">
          <h1 class="tf-page-title">💼 Career Insights</h1>
          <p class="tf-page-subtitle">AI-powered job role recommendations, salary benchmarks & 30-day roadmap</p>
        </div>

        <div *ngIf="!insights && !loading" class="generate-panel tf-card">
          <div class="gen-icon">🚀</div>
          <h2>Generate Your Career Insights</h2>
          <p>ForgeAI will analyze your readiness score, skills, and JD to provide personalized career recommendations.</p>
          <div *ngIf="error" class="tf-alert tf-alert-error">⚠️ {{ error }}</div>
          <button class="tf-btn tf-btn-primary tf-btn-lg" (click)="generate()" [disabled]="loading">
            ⚡ Generate Career Insights with ForgeAI
          </button>
        </div>

        <div *ngIf="loading" class="tf-loading">
          <div class="tf-spinner"></div>
          <p style="color:var(--tf-text-secondary)">ForgeAI is analyzing your career trajectory…</p>
        </div>

        <div *ngIf="insights && !loading" class="tf-fade-in">
          <!-- Market Demand Banner -->
          <div *ngIf="insights.market_demand" class="market-banner tf-card tf-mb-6"
               [class.high-demand]="insights.market_demand.demand_level === 'HIGH'">
            <div class="mb-left">
              <div class="mb-badge tf-badge" [class]="getDemandBadge()">{{ insights.market_demand.demand_level }} DEMAND</div>
              <p class="mb-text">{{ insights.market_demand.market_insight }}</p>
            </div>
            <div class="mb-right">
              <div class="mb-skills-label">🔥 Trending Skills</div>
              <div class="chip-group">
                <span *ngFor="let s of insights.market_demand.trending_skills" class="tf-chip tf-skill-chip">{{ s }}</span>
              </div>
            </div>
          </div>

          <!-- Salary Insights -->
          <div class="tf-card tf-mb-6" *ngIf="insights.salary_insights">
            <h3 class="section-head">💰 Salary Insights</h3>
            <div class="salary-grid">
              <div class="salary-item">
                <div class="sal-label">Current Market Range</div>
                <div class="sal-val tf-gradient-text">{{ insights.salary_insights.current_market_range }}</div>
              </div>
              <div class="salary-item">
                <div class="sal-label">Expected with Upskilling</div>
                <div class="sal-val tf-gradient-text">{{ insights.salary_insights.expected_with_skills }}</div>
              </div>
              <div class="salary-item">
                <div class="sal-label">Top Paying Companies</div>
                <div class="sal-companies">
                  <span *ngFor="let c of insights.salary_insights.top_paying_companies" class="tf-chip">{{ c }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Suitable Roles -->
          <div class="tf-card tf-mb-6">
            <h3 class="section-head">🎯 Suitable Roles for You</h3>
            <div class="roles-grid">
              <div *ngFor="let role of insights.suitable_roles" class="role-card tf-card">
                <div class="role-match">
                  <svg width="60" height="60">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/>
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#00d4ff" stroke-width="6"
                            stroke-linecap="round"
                            [attr.stroke-dasharray]="151"
                            [attr.stroke-dashoffset]="151 - (151 * role.match_percentage / 100)"
                            style="transform:rotate(-90deg);transform-origin:center"/>
                  </svg>
                  <div class="match-label">
                    <span class="match-pct tf-gradient-text">{{ role.match_percentage }}%</span>
                  </div>
                </div>
                <div class="role-info">
                  <div class="role-title">{{ role.title }}</div>
                  <div class="role-salary">{{ role.salary_range }}</div>
                  <div class="role-reason">{{ role.reason }}</div>
                  <div class="role-companies">
                    <span *ngFor="let c of role.companies?.slice(0,3)" class="tf-chip">{{ c }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 30-Day Roadmap -->
          <div class="tf-card tf-mb-6">
            <h3 class="section-head">📅 Your 30-Day Preparation Roadmap</h3>
            <div class="roadmap-list">
              <div *ngFor="let week of insights.thirty_day_roadmap; let i = index" class="roadmap-week">
                <div class="week-header">
                  <div class="week-num">{{ week.week }}</div>
                  <div class="week-focus">{{ week.focus }}</div>
                </div>
                <div class="week-goal">🎯 {{ week.goal }}</div>
                <div class="week-tasks">
                  <div *ngFor="let task of week.daily_tasks" class="week-task">▸ {{ task }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="tf-grid-2">
            <div class="tf-card" *ngIf="insights.skill_recommendations?.length">
              <h3 class="section-head">📚 Skills to Learn</h3>
              <div *ngFor="let s of insights.skill_recommendations" class="rec-item">
                <span>📌</span> {{ s }}
              </div>
            </div>
            <div class="tf-card" *ngIf="insights.certification_suggestions?.length">
              <h3 class="section-head">🏅 Recommended Certifications</h3>
              <div *ngFor="let c of insights.certification_suggestions" class="rec-item">
                <span>🎓</span> {{ c }}
              </div>
            </div>
          </div>

          <!-- Overall Advice -->
          <div class="tf-card advice-card tf-mt-4" *ngIf="insights.overall_advice">
            <div class="advice-icon">🤖</div>
            <div>
              <div class="advice-label">ForgeAI Personal Advice</div>
              <p class="advice-text">{{ insights.overall_advice }}</p>
            </div>
          </div>

          <div style="display:flex;gap:12px;margin-top:20px;justify-content:flex-end">
            <button class="tf-btn tf-btn-ghost" (click)="insights = null">🔄 Regenerate</button>
            <a routerLink="/report" class="tf-btn tf-btn-primary">📄 Download Full Report</a>
          </div>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .generate-panel { text-align:center; padding:60px 40px; max-width:560px; margin:0 auto; }
    .gen-icon { font-size:56px; margin-bottom:20px; }
    .generate-panel h2 { font-size:22px; font-weight:700; margin-bottom:10px; }
    .generate-panel p { color:var(--tf-text-secondary); margin-bottom:24px; }
    .market-banner { display:flex; gap:32px; flex-wrap:wrap; align-items:flex-start; }
    .high-demand { border-color:rgba(0,255,136,0.4); background:rgba(0,255,136,0.04); }
    .mb-badge { font-size:13px; font-weight:700; margin-bottom:10px; }
    .mb-text { font-size:14px; color:var(--tf-text-secondary); line-height:1.7; }
    .mb-right { flex:1; }
    .mb-skills-label { font-size:12px; color:var(--tf-text-secondary); margin-bottom:10px; text-transform:uppercase; letter-spacing:1px; }
    .chip-group { display:flex; flex-wrap:wrap; gap:6px; }
    .section-head { font-size:16px; font-weight:700; margin-bottom:20px; }
    .salary-grid { display:flex; gap:32px; flex-wrap:wrap; }
    .salary-item { }
    .sal-label { font-size:12px; color:var(--tf-text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
    .sal-val { font-size:24px; font-weight:800; }
    .sal-companies { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
    .roles-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px; }
    .role-card { padding:20px; cursor:default; }
    .role-match { position:relative; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
    .match-label { position:absolute; }
    .match-pct { font-size:13px; font-weight:800; }
    .role-info { margin-top:12px; }
    .role-title { font-size:16px; font-weight:700; margin-bottom:4px; }
    .role-salary { font-size:14px; color:var(--tf-primary); font-weight:600; margin-bottom:6px; }
    .role-reason { font-size:13px; color:var(--tf-text-secondary); margin-bottom:10px; line-height:1.5; }
    .role-companies { display:flex; flex-wrap:wrap; gap:4px; }
    .roadmap-list { display:flex; flex-direction:column; gap:16px; }
    .roadmap-week { padding:16px; background:var(--tf-card); border:1px solid var(--tf-border); border-radius:var(--tf-radius-sm); }
    .week-header { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
    .week-num { font-size:12px; font-weight:700; padding:3px 10px; background:var(--tf-primary-glow); color:var(--tf-primary); border-radius:20px; }
    .week-focus { font-size:15px; font-weight:700; }
    .week-goal { font-size:13px; color:var(--tf-primary); margin-bottom:8px; }
    .week-task { font-size:13px; color:var(--tf-text-secondary); padding:3px 0; }
    .rec-item { display:flex; gap:8px; font-size:14px; padding:8px 0; border-bottom:1px solid var(--tf-border); }
    .advice-card { display:flex; gap:16px; align-items:flex-start; background:rgba(0,212,255,0.04); border-color:var(--tf-border-glow); }
    .advice-icon { font-size:28px; flex-shrink:0; }
    .advice-label { font-size:12px; color:var(--tf-text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
    .advice-text { font-size:15px; color:var(--tf-text); line-height:1.8; }
  `]
})
export class CareerInsightsComponent implements OnInit {
    insights: any = null;
    loading = false;
    error = '';

    constructor(private apiService: ApiService) { }

    ngOnInit(): void { }

    generate(): void {
        this.loading = true; this.error = '';
        const jdId = sessionStorage.getItem('currentJdId');
        const mcqScore = sessionStorage.getItem('mcqScore');
        this.apiService.getCareerInsights({
            jd_record_id: jdId ? parseInt(jdId) : null,
            final_score: mcqScore ? parseFloat(mcqScore) : 0,
        }).subscribe({
            next: (res) => { this.insights = res.data || res; this.loading = false; },
            error: () => { this.error = 'Failed to generate insights. Please try again.'; this.loading = false; }
        });
    }

    getDemandBadge(): string {
        const d = this.insights?.market_demand?.demand_level;
        if (d === 'HIGH') return 'tf-badge tf-badge-success';
        if (d === 'MEDIUM') return 'tf-badge tf-badge-warning';
        return 'tf-badge tf-badge-error';
    }
}
