import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="tf-page">
      <nav class="tf-sidebar">
        <div class="tf-sidebar-logo"><div class="logo-text">⚡ TALENTFORGE</div></div>
        <div class="tf-sidebar-content">
          <a class="tf-nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span> Dashboard</a>
          <a class="tf-nav-item" routerLink="/jd-upload"><span class="nav-icon">📄</span> JD Analysis</a>
          <a class="tf-nav-item active" routerLink="/learning"><span class="nav-icon">🧠</span> ForgeAI Learning</a>
          <a class="tf-nav-item" routerLink="/mcq-test"><span class="nav-icon">📝</span> MCQ Test</a>
          <a class="tf-nav-item" routerLink="/weak-areas"><span class="nav-icon">⚠️</span> Weak Areas</a>
          <a class="tf-nav-item" routerLink="/readiness"><span class="nav-icon">🏆</span> Readiness</a>
          <a class="tf-nav-item" routerLink="/career-insights"><span class="nav-icon">💼</span> Career</a>
          <a class="tf-nav-item" routerLink="/report"><span class="nav-icon">📊</span> Report</a>
        </div>
      </nav>

      <main class="tf-main with-sidebar">
        <div class="tf-page-header">
          <h1 class="tf-page-title">🧠 ForgeAI Learning</h1>
          <p class="tf-page-subtitle">Topic-based learning content generated from your Job Description</p>
        </div>

        <!-- No JD Warning -->
        <div *ngIf="!jdRecordId" class="tf-card" style="text-align:center;padding:60px 40px">
          <div style="font-size:48px;margin-bottom:20px">📄</div>
          <h3 style="font-size:20px;font-weight:700;margin-bottom:12px">No Job Description Found</h3>
          <p style="color:var(--tf-text-secondary);margin-bottom:24px">Please upload and analyze a JD first to generate personalized learning content.</p>
          <a routerLink="/jd-upload" class="tf-btn tf-btn-primary tf-btn-lg">Upload JD → Start Learning</a>
        </div>

        <!-- Loading -->
        <div *ngIf="jdRecordId && loading" class="tf-loading">
          <div class="tf-spinner"></div>
          <p style="color:var(--tf-text-secondary);font-size:16px;margin-bottom:8px">ForgeAI is generating your personalized learning content…</p>
          <p style="font-size:13px;color:var(--tf-text-muted)">Analyzing JD and building topic modules — this can take 20–40 seconds</p>
          <p style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:8px">Please keep this tab open</p>
        </div>

        <!-- Error -->
        <div *ngIf="error" class="tf-card" style="text-align:center;padding:48px;max-width:500px;margin:0 auto">
          <div style="font-size:48px;margin-bottom:16px">⚠️</div>
          <h3 style="font-size:18px;font-weight:700;margin-bottom:12px">Generation Failed</h3>
          <div class="tf-alert tf-alert-error" style="margin-bottom:20px;text-align:left">{{ error }}</div>
          <p *ngIf="isRateLimit" style="color:var(--tf-text-secondary);font-size:14px;margin-bottom:20px">
            The AI is rate-limited right now. Wait 30 seconds then retry.
          </p>
          <button class="tf-btn tf-btn-primary" (click)="loadContent()" [disabled]="loading">
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Retrying...' : '🔄 Retry Generation' }}
          </button>
        </div>

        <!-- Learning Content -->
        <div *ngIf="topics.length && !loading" class="content-wrap tf-fade-in">

          <!-- Header Banner -->
          <div class="content-header tf-mb-6">
            <div>
              <h2 style="font-size:20px;font-weight:800">📚 Learning Content for: <span style="color:var(--tf-primary)">{{ jobTitle }}</span></h2>
              <p style="color:var(--tf-text-secondary);margin-top:4px">{{ topics.length }} topics generated · Study each topic then take the MCQ test</p>
            </div>
            <div style="display:flex;gap:10px;align-items:center">
              <div class="progress-pill">{{ completedCount }}/{{ topics.length }} Done</div>
              <button class="tf-btn tf-btn-ghost" (click)="loadContent()">🔄 Regenerate</button>
            </div>
          </div>

          <!-- Overall Progress Bar -->
          <div class="tf-progress-bar tf-mb-6" style="height:8px">
            <div class="tf-progress-fill" [style.width.%]="(completedCount / topics.length) * 100"></div>
          </div>

          <!-- Topic Cards -->
          <div class="topics-list">
            <div *ngFor="let topic of topics; let i = index"
                 class="topic-card"
                 [class.expanded]="expandedIdx === i"
                 [class.completed]="topic.done">

              <!-- Card Header -->
              <div class="topic-header" (click)="toggleTopic(i)">
                <div class="topic-left">
                  <div class="topic-num" [class.done]="topic.done">
                    {{ topic.done ? '✓' : (i + 1) }}
                  </div>
                  <div>
                    <div class="topic-name">{{ topic.name }}</div>
                    <div class="topic-category">{{ topic.category }}</div>
                  </div>
                </div>
                <div class="topic-right">
                  <span class="diff-badge" [class.beginner]="topic.difficulty === 'Beginner'" [class.advanced]="topic.difficulty === 'Advanced'">
                    {{ topic.difficulty }}
                  </span>
                  <span class="chevron" [class.open]="expandedIdx === i">▾</span>
                </div>
              </div>

              <!-- Card Body (expanded) -->
              <div class="topic-body" *ngIf="expandedIdx === i">

                <!-- Why it matters -->
                <div class="section-block why-block">
                  <div class="section-label">🎯 Why It Matters for This Role</div>
                  <p class="section-text">{{ topic.why_it_matters }}</p>
                </div>

                <!-- Explanation -->
                <div class="section-block">
                  <div class="section-label">📖 Explanation</div>
                  <p class="section-text">{{ topic.explanation }}</p>
                </div>

                <!-- Examples -->
                <div class="section-block" *ngIf="topic.real_world_example">
                  <div class="section-label">💡 Real-World Example</div>
                  <div class="example-box">{{ topic.real_world_example }}</div>
                  <div class="example-box" *ngIf="topic.second_example" style="margin-top:10px">{{ topic.second_example }}</div>
                </div>

                <!-- Key Points -->
                <div class="section-block" *ngIf="topic.key_points?.length">
                  <div class="section-label">🔑 Key Points to Remember</div>
                  <div class="key-points-grid">
                    <div *ngFor="let pt of topic.key_points" class="key-point-item">
                      <span class="kp-bullet">▸</span> {{ pt }}
                    </div>
                  </div>
                </div>

                <!-- Interview Tip -->
                <div class="interview-tip" *ngIf="topic.interview_tip">
                  <span class="tip-icon">🎤</span>
                  <div><strong>Interview Tip:</strong> {{ topic.interview_tip }}</div>
                </div>

                <!-- Done Button -->
                <div style="margin-top:20px;display:flex;justify-content:flex-end">
                  <button *ngIf="!topic.done" class="tf-btn tf-btn-primary" (click)="markDone(i)">
                    ✓ Mark as Understood → Next
                  </button>
                  <button *ngIf="topic.done" class="tf-btn tf-btn-ghost" (click)="unmarkDone(i)">
                    ↩ Review Again
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- MCQ Prompt (appears when any topic is explored) -->
          <div class="mcq-prompt-card tf-fade-in" *ngIf="completedCount > 0">
            <div class="mcq-prompt-left">
              <div class="mcq-prompt-icon">📝</div>
              <div>
                <div class="mcq-prompt-title" *ngIf="completedCount < topics.length">
                  You've completed {{ completedCount }} topic{{ completedCount > 1 ? 's' : '' }}! Ready to test yourself?
                </div>
                <div class="mcq-prompt-title" *ngIf="completedCount === topics.length">
                  🎉 You've studied all {{ topics.length }} topics. Time to prove it!
                </div>
                <div class="mcq-prompt-desc">Take an adaptive MCQ test based on these topics. Questions adjust to your skill level in real time.</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-end">
              <a routerLink="/mcq-test" class="tf-btn tf-btn-primary tf-btn-lg">Take MCQ Test →</a>
              <button *ngIf="completedCount < topics.length" class="tf-btn tf-btn-ghost" style="font-size:12px" (click)="scrollToNext()">
                Continue Learning ↓
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .content-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; }
    .progress-pill { background:var(--tf-primary-glow); color:var(--tf-primary); font-size:13px; font-weight:700; padding:6px 14px; border-radius:20px; }
    .topics-list { display:flex; flex-direction:column; gap:12px; margin-bottom:32px; }
    .topic-card { background:var(--tf-card); border:1px solid var(--tf-border); border-radius:var(--tf-radius); overflow:hidden; transition:border-color 0.2s; }
    .topic-card:hover { border-color:var(--tf-border-glow); }
    .topic-card.expanded { border-color:var(--tf-primary); box-shadow:0 0 0 1px rgba(0,212,255,0.3); }
    .topic-card.completed { border-color:rgba(0,255,136,0.4); }
    .topic-header { display:flex; align-items:center; justify-content:space-between; padding:18px 20px; cursor:pointer; user-select:none; }
    .topic-left { display:flex; align-items:center; gap:16px; }
    .topic-num { width:32px; height:32px; border-radius:50%; background:var(--tf-primary-glow); color:var(--tf-primary); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; flex-shrink:0; }
    .topic-num.done { background:rgba(0,255,136,0.15); color:var(--tf-success); }
    .topic-name { font-size:16px; font-weight:700; }
    .topic-category { font-size:12px; color:var(--tf-text-secondary); margin-top:2px; }
    .topic-right { display:flex; align-items:center; gap:12px; }
    .diff-badge { font-size:11px; font-weight:600; padding:3px 10px; border-radius:12px; background:rgba(255,255,255,0.08); color:var(--tf-text-secondary); }
    .diff-badge.beginner { background:rgba(0,255,136,0.12); color:var(--tf-success); }
    .diff-badge.advanced { background:rgba(255,68,68,0.12); color:var(--tf-error); }
    .chevron { font-size:18px; color:var(--tf-text-secondary); transition:transform 0.2s; }
    .chevron.open { transform:rotate(180deg); color:var(--tf-primary); }
    .topic-body { padding:0 20px 24px; border-top:1px solid var(--tf-border); }
    .section-block { margin-top:20px; }
    .section-label { font-size:11px; font-weight:700; color:var(--tf-text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; }
    .section-text { font-size:15px; color:var(--tf-text); line-height:1.8; }
    .why-block { background:rgba(0,212,255,0.04); border-left:3px solid var(--tf-primary); border-radius:0 8px 8px 0; padding:14px 16px; margin-top:20px; }
    .example-box { background:rgba(124,58,237,0.08); border:1px solid rgba(124,58,237,0.2); border-radius:8px; padding:14px 16px; font-size:14px; color:var(--tf-text); line-height:1.7; }
    .key-points-grid { display:flex; flex-direction:column; gap:8px; }
    .key-point-item { font-size:14px; color:var(--tf-text); display:flex; gap:8px; align-items:flex-start; line-height:1.6; }
    .kp-bullet { color:var(--tf-primary); font-weight:700; flex-shrink:0; margin-top:2px; }
    .interview-tip { display:flex; gap:12px; align-items:flex-start; background:rgba(255,180,0,0.08); border:1px solid rgba(255,180,0,0.2); border-radius:8px; padding:14px 16px; margin-top:20px; font-size:14px; color:var(--tf-text); line-height:1.6; }
    .tip-icon { font-size:20px; flex-shrink:0; }
    .mcq-prompt-card { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; padding:28px 32px; background:linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,212,255,0.08)); border:1px solid rgba(0,255,136,0.3); border-radius:var(--tf-radius); }
    .mcq-prompt-left { display:flex; align-items:center; gap:20px; }
    .mcq-prompt-icon { font-size:48px; flex-shrink:0; }
    .mcq-prompt-title { font-size:18px; font-weight:800; margin-bottom:6px; }
    .mcq-prompt-desc { font-size:14px; color:var(--tf-text-secondary); max-width:420px; line-height:1.6; }
  `]
})
export class LearningComponent implements OnInit {
  topics: any[] = [];
  loading = false;
  error = '';
  jdRecordId: number | null = null;
  jobTitle = '';
  expandedIdx: number = 0;

  constructor(private apiService: ApiService, private router: Router) { }

  get completedCount(): number {
    return this.topics.filter(t => t.done).length;
  }

  get isRateLimit(): boolean {
    return this.error.includes('429') || this.error.toLowerCase().includes('quota') || this.error.toLowerCase().includes('rate');
  }

  ngOnInit(): void {
    const saved = sessionStorage.getItem('currentJdId');
    const title = sessionStorage.getItem('currentJobTitle') || '';
    if (saved) {
      this.jdRecordId = parseInt(saved);
      this.jobTitle = title;
      this.loadContent();
    }
  }

  loadContent(): void {
    if (!this.jdRecordId) return;
    this.loading = true;
    this.error = '';
    this.topics = [];

    this.apiService.generateLearningContent({ jdRecordId: this.jdRecordId }).subscribe({
      next: (res) => {
        const data = res.data || res;

        // Check if AI engine returned an error object (e.g. 429 rate limit)
        if (data.error) {
          this.error = `AI Error: ${data.error}`;
          this.loading = false;
          return;
        }

        const topics = data.topics || [];
        if (!topics.length) {
          this.error = 'No topics were generated. Please try again in a moment.';
          this.loading = false;
          return;
        }

        this.topics = topics.map((t: any) => ({ ...t, done: false }));
        this.jobTitle = data.job_title || this.jobTitle;
        this.expandedIdx = 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to generate learning content. Please try again.';
        this.loading = false;
      }
    });
  }

  toggleTopic(idx: number): void {
    this.expandedIdx = this.expandedIdx === idx ? -1 : idx;
  }

  markDone(idx: number): void {
    this.topics[idx].done = true;
    // Auto-open next uncompleted topic
    const nextIdx = this.topics.findIndex((t, i) => i > idx && !t.done);
    if (nextIdx !== -1) {
      this.expandedIdx = nextIdx;
      setTimeout(() => {
        const el = document.querySelector(`.topics-list .topic-card:nth-child(${nextIdx + 1})`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      this.expandedIdx = -1;
    }
  }

  unmarkDone(idx: number): void {
    this.topics[idx].done = false;
    this.expandedIdx = idx;
  }

  scrollToNext(): void {
    const nextIdx = this.topics.findIndex(t => !t.done);
    if (nextIdx !== -1) {
      this.expandedIdx = nextIdx;
      setTimeout(() => {
        const el = document.querySelector(`.topics-list .topic-card:nth-child(${nextIdx + 1})`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }
}
