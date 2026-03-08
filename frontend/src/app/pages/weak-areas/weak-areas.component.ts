import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-weak-areas',
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
          <a class="tf-nav-item active" routerLink="/weak-areas"><span class="nav-icon">⚠️</span> Weak Areas</a>
          <a class="tf-nav-item" routerLink="/readiness"><span class="nav-icon">🏆</span> Readiness</a>
          <a class="tf-nav-item" routerLink="/career-insights"><span class="nav-icon">💼</span> Career</a>
          <a class="tf-nav-item" routerLink="/report"><span class="nav-icon">📊</span> Report</a>
        </div>
      </nav>

      <main class="tf-main with-sidebar">
        <div class="tf-page-header">
          <h1 class="tf-page-title">⚠️ Weak Area Detection</h1>
          <p class="tf-page-subtitle">ForgeAI identifies your knowledge gaps and generates targeted reinforcement</p>
        </div>

        <!-- Analyze button if no data -->
        <div *ngIf="!analyzed && !loading" class="analyze-panel tf-card">
          <div class="analyze-icon">🔍</div>
          <h2>Detect Your Weak Areas</h2>
          <p>ForgeAI will analyze your MCQ test results and identify which topics need reinforcement.</p>
          <div *ngIf="!hasMcqData" class="tf-alert tf-alert-warning tf-mt-4">
            ⚠️ Complete the MCQ Test first to enable weak area detection.
          </div>
          <button class="tf-btn tf-btn-primary tf-btn-lg" (click)="analyze()" [disabled]="loading || !hasMcqData">
            <span *ngIf="loading" class="spinner"></span>
            ⚡ Analyze Weak Areas with ForgeAI
          </button>
        </div>

        <div *ngIf="loading" class="tf-loading">
          <div class="tf-spinner"></div>
          <p>ForgeAI is analyzing your performance...</p>
        </div>

        <!-- Results -->
        <div *ngIf="analyzed && !loading" class="tf-fade-in">
          <!-- Summary -->
          <div class="weak-summary tf-grid-3 tf-mb-6">
            <div class="tf-card summary-card red-card">
              <div class="sc-icon">⚠️</div>
              <div class="sc-count">{{ weakResult?.weak_areas?.length || 0 }}</div>
              <div class="sc-label">Weak Areas</div>
            </div>
            <div class="tf-card summary-card green-card">
              <div class="sc-icon">✅</div>
              <div class="sc-count">{{ weakResult?.strong_areas?.length || 0 }}</div>
              <div class="sc-label">Strong Areas</div>
            </div>
            <div class="tf-card summary-card" [class.orange-card]="weakResult?.recommended_action !== 'READY'" [class.green-card]="weakResult?.recommended_action === 'READY'">
              <div class="sc-icon">🎯</div>
              <div class="sc-label" style="font-size:15px;font-weight:700">{{ weakResult?.recommended_action }}</div>
              <div class="sc-label">Next Action</div>
            </div>
          </div>

          <!-- Overall Assessment -->
          <div class="tf-card tf-mb-6" *ngIf="weakResult?.overall_assessment">
            <h3 class="section-h">🧠 ForgeAI Assessment</h3>
            <p class="assessment-text">{{ weakResult.overall_assessment }}</p>
          </div>

          <!-- Priority Improvements -->
          <div class="tf-card tf-mb-6" *ngIf="weakResult?.improvement_priority?.length">
            <h3 class="section-h">🚨 Priority Improvement Areas</h3>
            <div *ngFor="let item of weakResult.improvement_priority" class="priority-item">
              <div class="priority-header">
                <span class="priority-topic">{{ item.topic }}</span>
                <span class="tf-badge" [class]="getPriorityBadge(item.priority)">{{ item.priority }}</span>
                <span class="priority-time">⏱️ {{ item.estimated_study_time }}</span>
              </div>
              <p class="priority-reason">{{ item.reason }}</p>
              <div class="priority-scores">
                <span>Current: <strong style="color:var(--tf-error)">{{ item.current_score }}%</strong></span>
                <span>→ Target: <strong style="color:var(--tf-success)">{{ item.target_score }}%</strong></span>
              </div>
            </div>
          </div>

          <!-- Reinforcement Content -->
          <div *ngIf="reinforcement?.reinforcement_modules?.length" class="tf-fade-in">
            <h3 class="section-h tf-mb-4">📚 Targeted Reinforcement Content</h3>
            <div *ngFor="let mod of reinforcement.reinforcement_modules; let i = index" class="reinforcement-card tf-card tf-mb-4">
              <div class="rein-header" (click)="toggleModule(i)">
                <div class="rein-topic">📖 {{ mod.topic }}</div>
                <span class="expand-icon">{{ expandedModules[i] ? '▲' : '▼' }}</span>
              </div>
              <div *ngIf="expandedModules[i]" class="rein-content tf-fade-in">
                <div class="rein-section">
                  <div class="rein-label">Core Concept</div>
                  <p>{{ mod.core_concept }}</p>
                </div>
                <div class="rein-section">
                  <div class="rein-label">⚠️ Common Mistakes</div>
                  <ul>
                    <li *ngFor="let m of mod.common_mistakes">{{ m }}</li>
                  </ul>
                </div>
                <div class="rein-section">
                  <div class="rein-label">💡 Interview Tips</div>
                  <div *ngFor="let t of mod.interview_tips" class="tip-item-rein">▸ {{ t }}</div>
                </div>
                <div *ngIf="mod.code_example" class="rein-section">
                  <div class="rein-label">⌨️ Code Example</div>
                  <pre class="code-block">{{ mod.code_example }}</pre>
                </div>
                <div class="rein-section" *ngIf="mod.practice_questions?.length">
                  <div class="rein-label">🎯 Practice Questions</div>
                  <div *ngFor="let pq of mod.practice_questions" class="prac-q">
                    <div class="pq-question">Q: {{ pq.question }}</div>
                    <div class="pq-answer">A: {{ pq.answer }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="action-row">
            <button class="tf-btn tf-btn-ghost" (click)="analyze()">🔄 Re-analyze</button>
            <a routerLink="/readiness" class="tf-btn tf-btn-primary">Calculate Readiness →</a>
          </div>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .analyze-panel { text-align:center; padding:60px 40px; max-width:600px; margin:0 auto; }
    .analyze-icon { font-size:56px; margin-bottom:20px; }
    .analyze-panel h2 { font-size:22px; font-weight:700; margin-bottom:10px; }
    .analyze-panel p { color:var(--tf-text-secondary); margin-bottom:24px; }
    .summary-card { text-align:center; padding:28px; }
    .sc-icon { font-size:32px; margin-bottom:8px; }
    .sc-count { font-size:40px; font-weight:900; }
    .sc-label { font-size:13px; color:var(--tf-text-secondary); text-transform:uppercase; letter-spacing:1px; margin-top:4px; }
    .red-card { border-color:rgba(255,68,68,0.3); }
    .red-card .sc-count { color:var(--tf-error); }
    .green-card { border-color:rgba(0,255,136,0.3); }
    .green-card .sc-count { color:var(--tf-success); }
    .orange-card { border-color:rgba(255,170,0,0.3); }
    .section-h { font-size:16px; font-weight:700; margin-bottom:16px; }
    .assessment-text { font-size:15px; color:var(--tf-text-secondary); line-height:1.8; }
    .priority-item { padding:16px; background:var(--tf-card); border-radius:var(--tf-radius-sm); margin-bottom:12px; border:1px solid var(--tf-border); }
    .priority-header { display:flex; align-items:center; gap:10px; margin-bottom:8px; flex-wrap:wrap; }
    .priority-topic { font-size:15px; font-weight:700; flex:1; }
    .priority-time { font-size:12px; color:var(--tf-text-secondary); }
    .priority-reason { font-size:13px; color:var(--tf-text-secondary); margin-bottom:8px; }
    .priority-scores { display:flex; gap:16px; font-size:13px; }
    .reinforcement-card { overflow:hidden; }
    .rein-header { display:flex; justify-content:space-between; align-items:center; cursor:pointer; }
    .rein-topic { font-size:16px; font-weight:700; }
    .expand-icon { color:var(--tf-text-secondary); }
    .rein-content { padding-top:20px; margin-top:16px; border-top:1px solid var(--tf-border); }
    .rein-section { margin-bottom:16px; }
    .rein-label { font-size:11px; color:var(--tf-text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; font-weight:700; }
    .rein-section p { font-size:14px; color:var(--tf-text-secondary); line-height:1.7; }
    .rein-section ul { padding-left:16px; }
    .rein-section li { font-size:13px; color:var(--tf-text-secondary); margin-bottom:4px; }
    .tip-item-rein { font-size:13px; color:var(--tf-text-secondary); margin-bottom:6px; }
    .code-block { background:rgba(0,212,255,0.05); border:1px solid var(--tf-border-glow); border-radius:var(--tf-radius-sm); padding:12px; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--tf-primary); overflow-x:auto; white-space:pre-wrap; }
    .prac-q { background:var(--tf-bg-2); border-radius:var(--tf-radius-sm); padding:12px; margin-bottom:8px; }
    .pq-question { font-size:13px; font-weight:600; margin-bottom:6px; }
    .pq-answer { font-size:13px; color:var(--tf-text-secondary); }
    .action-row { display:flex; gap:12px; justify-content:flex-end; margin-top:24px; }
  `]
})
export class WeakAreasComponent implements OnInit {
    analyzed = false;
    loading = false;
    weakResult: any = null;
    reinforcement: any = null;
    hasMcqData = false;
    expandedModules: boolean[] = [];

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.hasMcqData = !!sessionStorage.getItem('topicStats');
    }

    analyze(): void {
        const raw = sessionStorage.getItem('topicStats');
        if (!raw) return;
        const topicStats = JSON.parse(raw);
        const topicScores: { [k: string]: number } = {};
        Object.keys(topicStats).forEach(k => {
            topicScores[k] = Math.round((topicStats[k].correct / topicStats[k].total) * 100);
        });

        this.loading = true;
        this.apiService.detectWeakAreas({ topic_scores: topicScores, threshold: 60 }).subscribe({
            next: (res) => {
                this.weakResult = res.data || res;
                this.analyzed = true;
                if (this.weakResult?.weak_areas?.length) {
                    this.generateReinforcement(this.weakResult.weak_areas);
                } else {
                    this.loading = false;
                }
            },
            error: () => { this.loading = false; }
        });
    }

    generateReinforcement(weakTopics: string[]): void {
        const jdId = sessionStorage.getItem('currentJdId');
        this.apiService.getReinforcement({ weak_topics: weakTopics, jd_record_id: jdId }).subscribe({
            next: (res) => {
                this.reinforcement = res.data || res;
                this.expandedModules = new Array(this.reinforcement?.reinforcement_modules?.length || 0).fill(false);
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    toggleModule(i: number): void { this.expandedModules[i] = !this.expandedModules[i]; }

    getPriorityBadge(priority: string): string {
        if (priority === 'HIGH') return 'tf-badge tf-badge-error';
        if (priority === 'MEDIUM') return 'tf-badge tf-badge-warning';
        return 'tf-badge tf-badge-success';
    }
}
