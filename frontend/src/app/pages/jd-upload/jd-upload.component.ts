import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-jd-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="tf-page">
      <nav class="tf-sidebar">
        <div class="tf-sidebar-logo"><div class="logo-text">⚡ TALENTFORGE</div><div class="logo-sub">ForgeAI Engine</div></div>
        <div class="tf-sidebar-content">
          <a class="tf-nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span> Dashboard</a>
          <a class="tf-nav-item active" routerLink="/jd-upload"><span class="nav-icon">📄</span> JD Analysis</a>
          <a class="tf-nav-item" routerLink="/learning"><span class="nav-icon">🧠</span> ForgeAI Learning</a>
          <a class="tf-nav-item" routerLink="/mcq-test"><span class="nav-icon">📝</span> MCQ Test</a>
          <a class="tf-nav-item" routerLink="/weak-areas"><span class="nav-icon">⚠️</span> Weak Areas</a>
          <a class="tf-nav-item" routerLink="/readiness"><span class="nav-icon">🏆</span> Readiness</a>
          <a class="tf-nav-item" routerLink="/career-insights"><span class="nav-icon">💼</span> Career</a>
          <a class="tf-nav-item" routerLink="/report"><span class="nav-icon">📊</span> Report</a>
        </div>
      </nav>

      <main class="tf-main with-sidebar">
        <div class="tf-page-header">
          <h1 class="tf-page-title">📄 JD Analysis</h1>
          <p class="tf-page-subtitle">Paste a job description and ForgeAI will generate personalized learning content for you</p>
        </div>

        <!-- Upload Form -->
        <div *ngIf="!analysisComplete" class="tf-grid-2" style="gap:24px;align-items:start">
          <div class="tf-card">
            <h3 style="font-size:17px;font-weight:700;margin-bottom:6px">Paste Job Description</h3>
            <p style="color:var(--tf-text-secondary);font-size:13px;margin-bottom:20px">
              ForgeAI will extract all key skills and generate topic-based learning content tailored to this role.
            </p>
            <div class="tf-form-group">
              <label class="tf-label">Job Title</label>
              <input class="tf-input" [(ngModel)]="jobTitle" placeholder="e.g. Senior Spring Boot Developer">
            </div>
            <div class="tf-form-group">
              <label class="tf-label">Job Description Text *</label>
              <textarea class="tf-textarea" [(ngModel)]="jdText" rows="14"
                        placeholder="Paste the full job description here...&#10;&#10;We are looking for a Senior Java Developer with 5+ years of experience..."></textarea>
            </div>
            <div *ngIf="error" class="tf-alert tf-alert-error">⚠️ {{ error }}</div>
            <button class="tf-btn tf-btn-primary tf-btn-full tf-btn-lg" (click)="analyze()" [disabled]="loading || !jdText.trim()">
              <span *ngIf="loading" class="spinner"></span>
              {{ loading ? '⚙️ Analyzing JD...' : '⚡ Analyze & Generate Learning Content' }}
            </button>
            <p *ngIf="loading" class="loading-hint">Analyzing your JD… this may take up to 20 seconds</p>
          </div>

          <!-- Tips -->
          <div>
            <div class="tf-card tf-mb-4">
              <h4 style="font-size:15px;font-weight:700;margin-bottom:16px">🎯 What Happens Next</h4>
              <div *ngFor="let tip of steps" class="tip-item">
                <span class="tip-icon">{{ tip.icon }}</span>
                <div>
                  <div class="tip-title">{{ tip.title }}</div>
                  <div class="tip-desc">{{ tip.desc }}</div>
                </div>
              </div>
            </div>
            <div class="tf-card" *ngIf="history.length > 0">
              <h4 style="font-size:15px;font-weight:700;margin-bottom:16px">📋 Recent JDs</h4>
              <div *ngFor="let jd of history.slice(0,3)" class="history-item" (click)="useHistory(jd)">
                <div class="history-title">{{ jd.jobTitle || 'Untitled JD' }}</div>
                <div class="history-date">{{ jd.createdDate | date:'MMM dd' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Redirect Screen -->
        <div *ngIf="analysisComplete" class="success-screen tf-fade-in">
          <div class="success-card tf-card">
            <div class="success-icon">✅</div>
            <h2 class="success-title">JD Analyzed Successfully!</h2>
            <p class="success-subtitle">ForgeAI has extracted all skills and topics from your JD.</p>
            <p class="success-role">Role: <strong style="color:var(--tf-primary)">{{ jobTitle }}</strong></p>
            <div class="success-actions">
              <a routerLink="/learning" class="tf-btn tf-btn-primary tf-btn-lg">
                🧠 Start Learning →
              </a>
              <button class="tf-btn tf-btn-ghost" (click)="reset()">Upload Another JD</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .loading-hint { text-align:center; color:var(--tf-text-secondary); font-size:13px; margin-top:12px; }
    .tip-item { display:flex; gap:12px; margin-bottom:14px; align-items:flex-start; }
    .tip-icon { font-size:20px; flex-shrink:0; }
    .tip-title { font-size:14px; font-weight:600; }
    .tip-desc { font-size:12px; color:var(--tf-text-secondary); }
    .history-item { display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:var(--tf-card); border-radius:var(--tf-radius-sm); cursor:pointer; margin-bottom:8px; }
    .history-item:hover { background:var(--tf-card-hover); }
    .history-title { font-size:14px; font-weight:500; }
    .history-date { font-size:12px; color:var(--tf-text-secondary); }
    .success-screen { display:flex; justify-content:center; align-items:center; min-height:60vh; }
    .success-card { text-align:center; padding:60px 48px; max-width:480px; width:100%; }
    .success-icon { font-size:64px; margin-bottom:24px; }
    .success-title { font-size:26px; font-weight:800; margin-bottom:10px; }
    .success-subtitle { color:var(--tf-text-secondary); font-size:15px; margin-bottom:8px; }
    .success-role { font-size:15px; margin-bottom:32px; }
    .success-actions { display:flex; flex-direction:column; gap:12px; align-items:center; }
  `]
})
export class JdUploadComponent implements OnInit {
  jdText = '';
  jobTitle = '';
  loading = false;
  error = '';
  analysisComplete = false;
  history: any[] = [];

  steps = [
    { icon: '📄', title: 'JD Analysis', desc: 'ForgeAI extracts skills, tools, and responsibilities' },
    { icon: '🧠', title: 'Learning Content', desc: 'Topic-based modules with explanations and examples' },
    { icon: '📝', title: 'MCQ Test', desc: 'Adaptive test based on your JD topics' },
  ];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.apiService.getJdHistory().subscribe({
      next: (res) => { if (res.status === 'SUCCESS') this.history = res.data || []; },
      error: () => { }
    });
  }

  analyze(): void {
    if (!this.jdText.trim()) return;
    this.loading = true;
    this.error = '';
    this.apiService.analyzeJd(this.jdText, this.jobTitle).subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
          const jdId = res.data.id;
          this.jobTitle = this.jobTitle || res.data.jobTitle || 'Your Role';
          sessionStorage.setItem('currentJdId', String(jdId));
          sessionStorage.setItem('currentJobTitle', this.jobTitle);
          this.analysisComplete = true;
        } else {
          this.error = res.message || 'Analysis failed.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Analysis failed. Please try again.';
        this.loading = false;
      }
    });
  }

  useHistory(jd: any): void {
    sessionStorage.setItem('currentJdId', String(jd.id));
    sessionStorage.setItem('currentJobTitle', jd.jobTitle || '');
    this.router.navigate(['/learning']);
  }

  reset(): void {
    this.analysisComplete = false;
    this.jdText = '';
    this.jobTitle = '';
    this.error = '';
  }
}
