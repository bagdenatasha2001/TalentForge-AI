import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="tf-page">
      <!-- Sidebar -->
      <nav class="tf-sidebar">
        <div class="tf-sidebar-logo">
          <div class="logo-text">⚡ TALENTFORGE</div>
          <div class="logo-sub">ForgeAI Engine</div>
        </div>
        <div class="tf-sidebar-content">
          <a class="tf-nav-item active" routerLink="/dashboard"><span class="nav-icon">🏠</span> Dashboard</a>
          <a class="tf-nav-item" routerLink="/jd-upload"><span class="nav-icon">📄</span> JD Analysis</a>
          <a class="tf-nav-item" routerLink="/learning"><span class="nav-icon">🧠</span> ForgeAI Learning</a>
          <a class="tf-nav-item" routerLink="/mcq-test"><span class="nav-icon">📝</span> MCQ Test</a>
          <a class="tf-nav-item" routerLink="/weak-areas"><span class="nav-icon">⚠️</span> Weak Areas</a>
          <a class="tf-nav-item" routerLink="/readiness"><span class="nav-icon">🏆</span> Readiness Score</a>
          <a class="tf-nav-item" routerLink="/career-insights"><span class="nav-icon">💼</span> Career Insights</a>
          <a class="tf-nav-item" routerLink="/report"><span class="nav-icon">📊</span> Report</a>
          <a class="tf-nav-item" routerLink="/profile"><span class="nav-icon">👤</span> Profile</a>
          <a *ngIf="isAdmin" class="tf-nav-item" routerLink="/admin"><span class="nav-icon">🛡️</span> Admin Panel</a>
        </div>
        <div class="tf-sidebar-footer">
          <div class="tf-sidebar-user">
            <div class="tf-avatar">{{ userInitial }}</div>
            <div>
              <div class="tf-user-name">{{ userName }}</div>
              <div class="tf-user-role">{{ userRole }}</div>
            </div>
          </div>
          <button class="tf-btn tf-btn-ghost tf-btn-sm tf-btn-full" style="margin-top:10px" (click)="logout()">🚪 Sign Out</button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="tf-main with-sidebar">
        <!-- Page Header -->
        <div class="tf-page-header tf-flex tf-justify-between tf-items-center">
          <div>
            <h1 class="tf-page-title">Welcome back, {{ firstName }}! 👋</h1>
            <p class="tf-page-subtitle">Your AI-powered interview preparation dashboard</p>
          </div>
          <a routerLink="/jd-upload" class="tf-btn tf-btn-primary">
            🚀 Start New Preparation
          </a>
        </div>

        <!-- Readiness Score Hero -->
        <div class="readiness-hero tf-card tf-card-glow tf-mb-6" *ngIf="dashboardData">
          <div class="readiness-hero-inner">
            <div class="readiness-ring">
              <svg width="140" height="140">
                <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10"/>
                <circle cx="70" cy="70" r="58" fill="none" stroke="url(#scoreGrad)" stroke-width="10"
                        stroke-linecap="round"
                        [attr.stroke-dasharray]="'364.4'"
                        [attr.stroke-dashoffset]="364.4 - (364.4 * (dashboardData.finalScore || 0) / 100)"
                        style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 1s ease"/>
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#00d4ff"/>
                    <stop offset="100%" stop-color="#0066ff"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="ring-label">
                <span class="ring-score">{{ dashboardData.finalScore | number:'1.0-0' }}</span>
                <span class="ring-sub">/ 100</span>
              </div>
            </div>
            <div class="readiness-info">
              <div class="readiness-level" [class]="getLevelClass()">{{ getLevelLabel() }}</div>
              <h2 class="readiness-title">Readiness Score</h2>
              <p class="readiness-desc">Based on MCQ, Coding, JD Match & Learning Depth performance</p>
              <div class="readiness-metrics">
                <div class="metric">
                  <span class="metric-label">MCQ Score</span>
                  <span class="metric-val">{{ dashboardData.mcqScore | number:'1.0-0' }}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Coding</span>
                  <span class="metric-val">{{ dashboardData.codingScore | number:'1.0-0' }}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">JD Match</span>
                  <span class="metric-val">{{ dashboardData.jdMatchScore | number:'1.0-0' }}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Learning</span>
                  <span class="metric-val">{{ dashboardData.learningDepthScore | number:'1.0-0' }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No data state -->
        <div class="empty-state tf-card tf-mb-6" *ngIf="!dashboardData || !dashboardData.finalScore">
          <div class="empty-icon">🚀</div>
          <h3>Start Your Preparation Journey</h3>
          <p>Upload a job description to begin your personalized AI interview preparation.</p>
          <a routerLink="/jd-upload" class="tf-btn tf-btn-primary" style="margin-top:16px">Upload Job Description →</a>
        </div>

        <!-- Quick Actions -->
        <div class="tf-grid-4 tf-mb-6">
          <a *ngFor="let action of quickActions" [routerLink]="action.route" class="action-card tf-card">
            <div class="action-icon">{{ action.icon }}</div>
            <div class="action-title">{{ action.title }}</div>
            <div class="action-desc">{{ action.desc }}</div>
          </a>
        </div>

        <!-- Preparation Flow -->
        <div class="tf-card">
          <h3 class="section-head">🔄 Preparation Flow</h3>
          <div class="prep-flow">
            <div *ngFor="let step of prepFlow; let i = index" class="prep-step"
                 [class.done]="step.done">
              <div class="prep-step-num">{{ i + 1 }}</div>
              <div class="prep-step-info">
                <div class="prep-step-name">{{ step.name }}</div>
                <div class="prep-step-status">{{ step.done ? '✅ Completed' : '⏳ Pending' }}</div>
              </div>
              <a [routerLink]="step.route" class="tf-btn tf-btn-sm" [class]="step.done ? 'tf-btn-ghost' : 'tf-btn-primary'">
                {{ step.done ? 'View' : 'Start' }}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .readiness-hero { padding: 32px; }
    .readiness-hero-inner { display: flex; gap: 40px; align-items: center; flex-wrap: wrap; }
    .readiness-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ring-label { position: absolute; text-align: center; }
    .ring-score { font-size: 32px; font-weight: 900; color: var(--tf-primary); display: block; }
    .ring-sub { font-size: 13px; color: var(--tf-text-secondary); }
    .readiness-info { flex: 1; min-width: 200px; }
    .readiness-level {
      display: inline-block; padding: 5px 14px; border-radius: 20px;
      font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
      margin-bottom: 10px;
    }
    .level-not-ready { background: rgba(255,68,68,0.15); color: var(--tf-error); border: 1px solid rgba(255,68,68,0.3); }
    .level-improving { background: rgba(255,170,0,0.15); color: var(--tf-warning); border: 1px solid rgba(255,170,0,0.3); }
    .level-ready { background: rgba(0,255,136,0.15); color: var(--tf-success); border: 1px solid rgba(0,255,136,0.3); }
    .level-competitive { background: var(--tf-primary-glow); color: var(--tf-primary); border: 1px solid var(--tf-border-glow); }
    .readiness-title { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
    .readiness-desc { color: var(--tf-text-secondary); font-size: 14px; margin-bottom: 20px; }
    .readiness-metrics { display: flex; gap: 24px; flex-wrap: wrap; }
    .metric { }
    .metric-label { font-size: 11px; color: var(--tf-text-secondary); text-transform: uppercase; letter-spacing: 0.8px; display: block; }
    .metric-val { font-size: 20px; font-weight: 800; color: var(--tf-text); }

    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-icon { font-size: 56px; margin-bottom: 16px; }
    .empty-state h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
    .empty-state p { color: var(--tf-text-secondary); font-size: 14px; }

    .action-card { cursor: pointer; text-decoration: none; display: block; }
    .action-card:hover { background: var(--tf-card-hover); }
    .action-icon { font-size: 28px; margin-bottom: 12px; }
    .action-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
    .action-desc { font-size: 12px; color: var(--tf-text-secondary); }

    .section-head { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
    .prep-flow { display: flex; flex-direction: column; gap: 12px; }
    .prep-step {
      display: flex; align-items: center; gap: 16px;
      padding: 14px 16px; background: var(--tf-card);
      border: 1px solid var(--tf-border); border-radius: var(--tf-radius-sm);
      transition: all 0.2s ease;
    }
    .prep-step.done { opacity: 0.7; }
    .prep-step-num {
      width: 30px; height: 30px; border-radius: 50%;
      background: var(--tf-bg-2); border: 1.5px solid var(--tf-border);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; flex-shrink: 0;
    }
    .prep-step.done .prep-step-num { background: var(--tf-primary); border-color: var(--tf-primary); color: #000; }
    .prep-step-info { flex: 1; }
    .prep-step-name { font-size: 14px; font-weight: 600; }
    .prep-step-status { font-size: 12px; color: var(--tf-text-secondary); margin-top: 2px; }
  `]
})
export class DashboardComponent implements OnInit {
    dashboardData: any = null;
    userName = '';
    userRole = '';
    isAdmin = false;

    get firstName(): string { return this.userName.split(' ')[0]; }
    get userInitial(): string { return this.userName.charAt(0).toUpperCase() || 'U'; }

    quickActions = [
        { icon: '📄', title: 'Upload JD', desc: 'Analyze a new job description', route: '/jd-upload' },
        { icon: '🧠', title: 'ForgeAI Learning', desc: 'Generate practice questions', route: '/learning' },
        { icon: '📝', title: 'Take MCQ Test', desc: 'Adaptive knowledge quiz', route: '/mcq-test' },
        { icon: '💼', title: 'Career Insights', desc: 'Roles, salary & roadmap', route: '/career-insights' },
    ];

    prepFlow = [
        { name: 'Upload & Analyze JD', done: false, route: '/jd-upload' },
        { name: 'ForgeAI Learning (10/set × 10 = 100 Q)', done: false, route: '/learning' },
        { name: 'Adaptive MCQ Test', done: false, route: '/mcq-test' },
        { name: 'Weak Area Reinforcement', done: false, route: '/weak-areas' },
        { name: 'Final Readiness Evaluation', done: false, route: '/readiness' },
        { name: 'Career Insights', done: false, route: '/career-insights' },
        { name: 'Download Performance Report', done: false, route: '/report' },
    ];

    constructor(private authService: AuthService, private apiService: ApiService, private router: Router) { }

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.userName = user.fullName || user.email;
            this.userRole = user.role;
            this.isAdmin = user.role === 'ADMIN';
        }
        this.apiService.getDashboard().subscribe({
            next: (res) => { if (res.status === 'SUCCESS') this.dashboardData = res.data; },
            error: () => { }
        });
    }

    getLevelClass(): string {
        const level = this.dashboardData?.level || '';
        if (level === 'NOT_READY') return 'readiness-level level-not-ready';
        if (level === 'IMPROVING') return 'readiness-level level-improving';
        if (level === 'INTERVIEW_READY') return 'readiness-level level-ready';
        if (level === 'HIGHLY_COMPETITIVE') return 'readiness-level level-competitive';
        return 'readiness-level level-not-ready';
    }

    getLevelLabel(): string {
        const level = this.dashboardData?.level || '';
        const map: any = { NOT_READY: '🔴 Not Ready', IMPROVING: '🟡 Improving', INTERVIEW_READY: '🟢 Interview Ready', HIGHLY_COMPETITIVE: '⭐ Highly Competitive' };
        return map[level] || '–';
    }

    logout(): void { this.authService.logout(); }
}
