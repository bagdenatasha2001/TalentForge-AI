import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-readiness',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
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
          <a class="tf-nav-item active" routerLink="/readiness"><span class="nav-icon">🏆</span> Readiness</a>
          <a class="tf-nav-item" routerLink="/career-insights"><span class="nav-icon">💼</span> Career</a>
          <a class="tf-nav-item" routerLink="/report"><span class="nav-icon">📊</span> Report</a>
        </div>
      </nav>

      <main class="tf-main with-sidebar">
        <div class="tf-page-header">
          <h1 class="tf-page-title">🏆 Readiness Score</h1>
          <p class="tf-page-subtitle">Final evaluation — weighted formula: (MCQ×0.35) + (Coding×0.30) + (JD Match×0.20) + (Learning×0.15)</p>
        </div>

        <!-- Input Form -->
        <div *ngIf="!score" class="tf-grid-2" style="align-items:start;gap:24px">
          <div class="tf-card">
            <h3 class="form-title">Calculate Your Readiness Score</h3>
            <p style="color:var(--tf-text-secondary);font-size:13px;margin-bottom:24px">
              Enter your component scores below. MCQ data is auto-loaded if available.
            </p>
            <div class="tf-form-group">
              <label class="tf-label">MCQ Score (0–100) <span class="weight-hint">× 35%</span></label>
              <input class="tf-input" type="number" [(ngModel)]="inputs.mcqScore" min="0" max="100" placeholder="0–100">
            </div>
            <div class="tf-form-group">
              <label class="tf-label">Coding Score (0–100) <span class="weight-hint">× 30%</span></label>
              <input class="tf-input" type="number" [(ngModel)]="inputs.codingScore" min="0" max="100" placeholder="0–100">
            </div>
            <div class="tf-form-group">
              <label class="tf-label">JD Match Score (0–100) <span class="weight-hint">× 20%</span></label>
              <input class="tf-input" type="number" [(ngModel)]="inputs.jdMatchScore" min="0" max="100" placeholder="0–100">
            </div>
            <div class="tf-form-group">
              <label class="tf-label">Learning Depth Score (0–100) <span class="weight-hint">× 15%</span></label>
              <input class="tf-input" type="number" [(ngModel)]="inputs.learningDepthScore" min="0" max="100" placeholder="0–100">
            </div>

            <!-- Live preview -->
            <div class="live-preview">
              <div class="preview-label">Live Preview</div>
              <div class="preview-score tf-gradient-text">{{ computeLive() | number:'1.1-1' }}</div>
              <div class="preview-sub">/ 100</div>
            </div>

            <div *ngIf="error" class="tf-alert tf-alert-error">⚠️ {{ error }}</div>
            <button class="tf-btn tf-btn-primary tf-btn-full tf-btn-lg" (click)="calculate()" [disabled]="loading">
              <span *ngIf="loading" class="spinner"></span>
              {{ loading ? 'Calculating...' : '⚡ Calculate Final Score' }}
            </button>
          </div>

          <!-- Formula Card -->
          <div class="tf-card formula-card">
            <h4 style="font-size:15px;font-weight:700;margin-bottom:16px">📐 Scoring Formula</h4>
            <div class="formula-display">
              <div class="formula-line">FinalScore =</div>
              <div class="formula-component"><span class="f-color">MCQ</span> × 0.35</div>
              <div class="formula-plus">+</div>
              <div class="formula-component"><span class="f-color">Coding</span> × 0.30</div>
              <div class="formula-plus">+</div>
              <div class="formula-component"><span class="f-color">JD Match</span> × 0.20</div>
              <div class="formula-plus">+</div>
              <div class="formula-component"><span class="f-color">Learning</span> × 0.15</div>
            </div>
            <div class="levels-table">
              <div class="level-row" *ngFor="let l of levels">
                <span class="level-dot" [style.background]="l.color"></span>
                <span class="level-label">{{ l.label }}</span>
                <span class="level-range">{{ l.range }}</span>
              </div>
            </div>
            <div *ngIf="latestScore" class="latest-badge">
              <div class="lb-label">Previous Score</div>
              <div class="lb-score tf-gradient-text">{{ latestScore.finalScore | number:'1.1-1' }}</div>
            </div>
          </div>
        </div>

        <!-- Score Result -->
        <div *ngIf="score" class="score-result tf-fade-in">
          <div class="result-hero tf-card tf-mb-6">
            <div class="hero-ring">
              <svg width="180" height="180">
                <circle cx="90" cy="90" r="74" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12"/>
                <circle cx="90" cy="90" r="74" fill="none" stroke="url(#rGrad)" stroke-width="12"
                        stroke-linecap="round"
                        [attr.stroke-dasharray]="465"
                        [attr.stroke-dashoffset]="465 - (465 * score.finalScore / 100)"
                        style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 1.5s ease"/>
                <defs>
                  <linearGradient id="rGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#00d4ff"/>
                    <stop offset="100%" stop-color="#0066ff"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="ring-value">
                <span class="ring-num tf-gradient-text">{{ score.finalScore | number:'1.0-0' }}</span>
                <span class="ring-denom">/100</span>
              </div>
            </div>
            <div class="hero-info">
              <div class="hero-level" [class]="getLevelClass(score.level)">{{ getLevelLabel(score.level) }}</div>
              <div class="hero-title">Interview Readiness Score</div>
              <div class="hero-desc">Based on your complete preparation performance</div>
              <div class="component-scores tf-mt-4">
                <div *ngFor="let cs of getComponentScores()" class="cs-row">
                  <span class="cs-label">{{ cs.label }}</span>
                  <div class="tf-progress-bar cs-bar">
                    <div class="tf-progress-fill" [style.width.%]="cs.value"></div>
                  </div>
                  <span class="cs-val">{{ cs.value | number:'1.0-0' }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="result-actions tf-mb-6">
            <button class="tf-btn tf-btn-ghost" (click)="score = null">← Recalculate</button>
            <a routerLink="/career-insights" class="tf-btn tf-btn-primary">View Career Insights →</a>
            <a routerLink="/report" class="tf-btn tf-btn-outline">📄 Download Report</a>
          </div>

          <!-- History -->
          <div class="tf-card" *ngIf="history.length">
            <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">📈 Score History</h3>
            <table class="tf-table">
              <thead><tr><th>Date</th><th>Score</th><th>MCQ</th><th>Coding</th><th>JD Match</th><th>Level</th></tr></thead>
              <tbody>
                <tr *ngFor="let h of history">
                  <td>{{ h.createdDate | date:'MMM dd, yyyy' }}</td>
                  <td><strong class="tf-gradient-text">{{ h.finalScore | number:'1.1-1' }}</strong></td>
                  <td>{{ h.mcqScore | number:'1.0-0' }}%</td>
                  <td>{{ h.codingScore | number:'1.0-0' }}%</td>
                  <td>{{ h.jdMatchScore | number:'1.0-0' }}%</td>
                  <td><span class="tf-badge tf-badge-primary">{{ h.level }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .form-title { font-size:17px; font-weight:700; margin-bottom:8px; }
    .weight-hint { color:var(--tf-primary); font-size:11px; font-weight:700; }
    .live-preview { text-align:center; background:var(--tf-card); border:1px solid var(--tf-border-glow); border-radius:var(--tf-radius-sm); padding:16px; margin-bottom:20px; }
    .preview-label { font-size:11px; color:var(--tf-text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; }
    .preview-score { font-size:42px; font-weight:900; }
    .preview-sub { font-size:13px; color:var(--tf-text-secondary); }
    .formula-card { }
    .formula-display { background:var(--tf-bg-2); border-radius:var(--tf-radius-sm); padding:20px; font-family:'JetBrains Mono',monospace; margin-bottom:20px; }
    .formula-line { font-size:12px; color:var(--tf-text-secondary); margin-bottom:8px; }
    .formula-component { font-size:14px; padding:4px 0; }
    .formula-plus { color:var(--tf-text-muted); padding:2px 0 2px 16px; font-size:13px; }
    .f-color { color:var(--tf-primary); font-weight:700; }
    .levels-table { }
    .level-row { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--tf-border); font-size:13px; }
    .level-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
    .level-label { flex:1; font-weight:500; }
    .level-range { color:var(--tf-text-secondary); }
    .latest-badge { margin-top:20px; text-align:center; padding:12px; background:var(--tf-primary-glow); border-radius:var(--tf-radius-sm); border:1px solid var(--tf-border-glow); }
    .lb-label { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--tf-text-secondary); }
    .lb-score { font-size:28px; font-weight:900; }
    .result-hero { display:flex; gap:40px; align-items:center; flex-wrap:wrap; padding:32px; }
    .hero-ring { position:relative; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ring-value { position:absolute; text-align:center; }
    .ring-num { font-size:38px; font-weight:900; display:block; line-height:1; }
    .ring-denom { font-size:14px; color:var(--tf-text-secondary); }
    .hero-info { flex:1; min-width:200px; }
    .hero-level { display:inline-block; padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:12px; }
    .level-not-ready { background:rgba(255,68,68,0.15); color:var(--tf-error); border:1px solid rgba(255,68,68,0.3); }
    .level-improving { background:rgba(255,170,0,0.15); color:var(--tf-warning); border:1px solid rgba(255,170,0,0.3); }
    .level-ready { background:rgba(0,255,136,0.15); color:var(--tf-success); border:1px solid rgba(0,255,136,0.3); }
    .level-competitive { background:var(--tf-primary-glow); color:var(--tf-primary); border:1px solid var(--tf-border-glow); }
    .hero-title { font-size:22px; font-weight:800; margin-bottom:4px; }
    .hero-desc { color:var(--tf-text-secondary); font-size:13px; }
    .component-scores { display:flex; flex-direction:column; gap:10px; }
    .cs-row { display:flex; align-items:center; gap:12px; }
    .cs-label { min-width:100px; font-size:13px; color:var(--tf-text-secondary); }
    .cs-bar { flex:1; }
    .cs-val { min-width:40px; font-size:13px; font-weight:700; }
    .result-actions { display:flex; gap:12px; flex-wrap:wrap; }
  `]
})
export class ReadinessComponent implements OnInit {
    score: any = null;
    latestScore: any = null;
    history: any[] = [];
    loading = false;
    error = '';
    inputs = { mcqScore: 0, codingScore: 0, jdMatchScore: 0, learningDepthScore: 0 };

    levels = [
        { label: 'Not Ready', range: '0 – 39', color: '#ff4444' },
        { label: 'Improving', range: '40 – 59', color: '#ffaa00' },
        { label: 'Interview Ready', range: '60 – 79', color: '#00ff88' },
        { label: 'Highly Competitive', range: '80 – 100', color: '#00d4ff' },
    ];

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        const mcqScore = sessionStorage.getItem('mcqScore');
        if (mcqScore) this.inputs.mcqScore = parseFloat(mcqScore);

        this.apiService.getLatestReadiness().subscribe({
            next: (res) => { if (res.status === 'SUCCESS' && res.data) this.latestScore = res.data; },
            error: () => { }
        });
        this.apiService.getReadinessHistory().subscribe({
            next: (res) => { if (res.status === 'SUCCESS') this.history = res.data || []; },
            error: () => { }
        });
    }

    computeLive(): number {
        return (this.inputs.mcqScore * 0.35) + (this.inputs.codingScore * 0.30) +
            (this.inputs.jdMatchScore * 0.20) + (this.inputs.learningDepthScore * 0.15);
    }

    calculate(): void {
        this.loading = true; this.error = '';
        const jdId = sessionStorage.getItem('currentJdId');
        this.apiService.calculateReadiness({ ...this.inputs, jdRecordId: jdId ? parseInt(jdId) : null }).subscribe({
            next: (res) => {
                if (res.status === 'SUCCESS') {
                    this.score = res.data;
                    this.history = [res.data, ...this.history].slice(0, 10);
                } else { this.error = res.message; }
                this.loading = false;
            },
            error: (err) => { this.error = err?.error?.message || 'Failed to calculate score.'; this.loading = false; }
        });
    }

    getComponentScores(): any[] {
        if (!this.score) return [];
        return [
            { label: 'MCQ (35%)', value: this.score.mcqScore || 0 },
            { label: 'Coding (30%)', value: this.score.codingScore || 0 },
            { label: 'JD Match (20%)', value: this.score.jdMatchScore || 0 },
            { label: 'Learning (15%)', value: this.score.learningDepthScore || 0 },
        ];
    }

    getLevelClass(level: string): string {
        const map: any = { NOT_READY: 'hero-level level-not-ready', IMPROVING: 'hero-level level-improving', INTERVIEW_READY: 'hero-level level-ready', HIGHLY_COMPETITIVE: 'hero-level level-competitive' };
        return map[level] || 'hero-level level-not-ready';
    }

    getLevelLabel(level: string): string {
        const map: any = { NOT_READY: '🔴 Not Ready', IMPROVING: '🟡 Improving', INTERVIEW_READY: '🟢 Interview Ready', HIGHLY_COMPETITIVE: '⭐ Highly Competitive' };
        return map[level] || '—';
    }
}
