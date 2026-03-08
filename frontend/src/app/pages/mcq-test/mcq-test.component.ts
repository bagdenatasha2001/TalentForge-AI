import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface McqQuestion {
  question_id: string;
  question_text: string;
  question_type: string;
  topic: string;
  skill_tag: string;
  difficulty: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: string;
  explanation: string;
  code_snippet: string | null;
}

@Component({
  selector: 'app-mcq-test',
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
          <a class="tf-nav-item active" routerLink="/mcq-test"><span class="nav-icon">📝</span> MCQ Test</a>
          <a class="tf-nav-item" routerLink="/weak-areas"><span class="nav-icon">⚠️</span> Weak Areas</a>
          <a class="tf-nav-item" routerLink="/readiness"><span class="nav-icon">🏆</span> Readiness</a>
          <a class="tf-nav-item" routerLink="/career-insights"><span class="nav-icon">💼</span> Career</a>
          <a class="tf-nav-item" routerLink="/report"><span class="nav-icon">📊</span> Report</a>
        </div>
      </nav>

      <main class="tf-main with-sidebar">
        <div class="tf-page-header">
          <h1 class="tf-page-title">📝 Adaptive MCQ Test</h1>
          <p class="tf-page-subtitle">Concept, Scenario & Coding MCQs — difficulty adapts to your performance</p>
        </div>

        <!-- Setup -->
        <div *ngIf="phase === 'setup'" class="setup-panel tf-card">
          <div class="setup-icon">📝</div>
          <h2 class="setup-title">Adaptive MCQ Test</h2>
          <p class="setup-desc">
            Questions are generated specifically from your JD's required skills and adjust to your performance level.
          </p>

          <!-- JD Context Banner -->
          <div *ngIf="jdRecordId" class="jd-context-banner">
            ✅ JD Loaded · Questions will be tailored to your analyzed job description
          </div>
          <div *ngIf="!jdRecordId" class="tf-alert tf-alert-error" style="margin-bottom:24px">
            ⚠️ No JD found. Please <a routerLink="/jd-upload" style="color:var(--tf-primary)">analyze a JD first</a>.
          </div>

          <div class="setup-grid">
            <div class="tf-form-group">
              <label class="tf-label">Number of Questions</label>
              <select class="tf-select" [(ngModel)]="testConfig.count">
                <option [value]="10">10 Questions</option>
                <option [value]="15">15 Questions</option>
                <option [value]="20">20 Questions</option>
              </select>
            </div>
            <div class="tf-form-group">
              <label class="tf-label">Difficulty Mode</label>
              <select class="tf-select" [(ngModel)]="testConfig.difficulty">
                <option value="ADAPTIVE">Adaptive (Recommended)</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>
          <div *ngIf="error" class="tf-alert tf-alert-error">⚠️ {{ error }}</div>
          <button class="tf-btn tf-btn-primary tf-btn-lg" (click)="startTest()" [disabled]="loading || !jdRecordId">
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Generating Test...' : '🚀 Start MCQ Test' }}
          </button>
        </div>

        <!-- Test In Progress -->
        <div *ngIf="phase === 'test' && currentQ" class="test-panel tf-fade-in">
          <!-- Top Bar -->
          <div class="test-topbar">
            <div class="test-progress-text">Question {{ currentIdx + 1 }} / {{ questions.length }}</div>
            <div class="test-meta">
              <span class="tf-badge tf-badge-primary">{{ currentQ.question_type }}</span>
              <span class="tf-badge tf-badge-warning">{{ currentQ.difficulty }}</span>
              <span class="tf-chip">{{ currentQ.topic }}</span>
            </div>
            <div class="test-score">Score: {{ correctCount }}/{{ currentIdx }}</div>
          </div>
          <div class="test-progress tf-progress-bar tf-mb-6">
            <div class="tf-progress-fill" [style.width.%]="((currentIdx) / questions.length * 100)"></div>
          </div>

          <div class="tf-grid-2" style="align-items:start;gap:24px">
            <div class="tf-card question-card">
              <!-- Code snippet if exists -->
              <pre *ngIf="currentQ.code_snippet" class="code-block tf-mb-4">{{ currentQ.code_snippet }}</pre>

              <div class="q-text tf-mb-6">{{ currentQ.question_text }}</div>

              <div class="options-list">
                <div *ngFor="let opt of optionKeys" class="tf-mcq-option"
                     [class.selected]="selectedAnswer === opt"
                     [class.correct]="answered && opt === currentQ.correct_answer"
                     [class.wrong]="answered && selectedAnswer === opt && opt !== currentQ.correct_answer"
                     (click)="!answered && selectAnswer(opt)">
                  <div class="tf-mcq-key">{{ opt }}</div>
                  <div class="option-text">{{ currentQ.options[opt] }}</div>
                </div>
              </div>

              <div *ngIf="answered" class="explanation-box tf-mt-4">
                <div class="exp-header">
                  <span [class]="selectedAnswer === currentQ.correct_answer ? 'correct-icon' : 'wrong-icon'">
                    {{ selectedAnswer === currentQ.correct_answer ? '✅ Correct!' : '❌ Incorrect' }}
                  </span>
                </div>
                <p class="exp-text">{{ currentQ.explanation }}</p>
              </div>

              <div class="q-nav-row">
                <button class="tf-btn tf-btn-ghost" *ngIf="!answered" disabled>Select an option first</button>
                <button class="tf-btn tf-btn-primary" *ngIf="answered && currentIdx < questions.length - 1" (click)="nextQuestion()">Next Question →</button>
                <button class="tf-btn tf-btn-primary" *ngIf="answered && currentIdx === questions.length - 1" (click)="finishTest()">Finish Test 🏆</button>
              </div>
            </div>

            <!-- Side Stats -->
            <div>
              <div class="tf-card stat-card tf-mb-4">
                <div class="stat-row"><span>✅ Correct</span><span class="stat-good">{{ correctCount }}</span></div>
                <div class="stat-row"><span>❌ Wrong</span><span class="stat-bad">{{ currentIdx - correctCount }}</span></div>
                <div class="stat-row"><span>⏳ Remaining</span><span>{{ questions.length - currentIdx - 1 }}</span></div>
              </div>
              <div class="tf-card topic-tracker">
                <div class="tracker-title">Topic Performance</div>
                <div *ngFor="let t of topicStats | keyvalue" class="topic-row">
                  <span class="topic-name">{{ t.key }}</span>
                  <span class="topic-score" [class.good]="(t.value.correct/t.value.total) >= 0.6">
                    {{ t.value.correct }}/{{ t.value.total }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div *ngIf="phase === 'results'" class="results-panel tf-fade-in">
          <div class="results-hero tf-card tf-mb-6">
            <div class="results-score">
              <div class="big-score tf-gradient-text">{{ scorePercent | number:'1.0-0' }}%</div>
              <div class="score-label">{{ getScoreLabel() }}</div>
              <div class="score-detail">{{ correctCount }} correct out of {{ questions.length }}</div>
            </div>
            <div class="results-actions">
              <a routerLink="/weak-areas" class="tf-btn tf-btn-primary">Analyze Weak Areas →</a>
              <button class="tf-btn tf-btn-ghost" (click)="resetTest()">Try Again</button>
            </div>
          </div>

          <div class="tf-card">
            <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">📊 Topic Breakdown</h3>
            <div *ngFor="let t of topicStats | keyvalue" class="topic-breakdown-row">
              <span class="tb-topic">{{ t.key }}</span>
              <div class="tf-progress-bar tb-bar">
                <div class="tf-progress-fill" [class.low]="(t.value.correct/t.value.total) < 0.6"
                     [style.width.%]="(t.value.correct / t.value.total) * 100"></div>
              </div>
              <span class="tb-pct" [class.low]="(t.value.correct/t.value.total) < 0.6">
                {{ (t.value.correct / t.value.total * 100) | number:'1.0-0' }}%
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .setup-panel { text-align:center; padding:60px 40px; max-width:600px; margin:0 auto; }
    .setup-icon { font-size:56px; margin-bottom:20px; }
    .setup-title { font-size:24px; font-weight:800; margin-bottom:10px; }
    .setup-desc { color:var(--tf-text-secondary); margin-bottom:32px; }
    .setup-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; text-align:left; }
    .test-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; flex-wrap:wrap; gap:10px; }
    .test-progress-text { font-size:14px; font-weight:600; }
    .test-meta { display:flex; gap:8px; }
    .test-score { font-size:14px; color:var(--tf-text-secondary); }
    .question-card { }
    .q-text { font-size:17px; font-weight:600; line-height:1.6; }
    .code-block { background:rgba(0,212,255,0.05); border:1px solid var(--tf-border-glow); border-radius:var(--tf-radius-sm); padding:14px; font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--tf-primary); overflow-x:auto; white-space:pre-wrap; }
    .option-text { font-size:14px; flex:1; }
    .explanation-box { background:rgba(0,212,255,0.05); border:1px solid var(--tf-border-glow); border-radius:var(--tf-radius-sm); padding:16px; }
    .exp-header { margin-bottom:8px; }
    .correct-icon { color:var(--tf-success); font-weight:700; }
    .wrong-icon { color:var(--tf-error); font-weight:700; }
    .exp-text { font-size:14px; color:var(--tf-text-secondary); line-height:1.7; }
    .q-nav-row { margin-top:20px; display:flex; justify-content:flex-end; }
    .stat-card .stat-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--tf-border); font-size:14px; }
    .stat-good { color:var(--tf-success); font-weight:700; }
    .stat-bad { color:var(--tf-error); font-weight:700; }
    .tracker-title { font-size:13px; font-weight:700; color:var(--tf-text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
    .topic-row { display:flex; justify-content:space-between; padding:8px 0; font-size:13px; }
    .topic-score { font-weight:700; }
    .topic-score.good { color:var(--tf-success); }
    .results-hero { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:24px; padding:36px; }
    .big-score { font-size:64px; font-weight:900; }
    .score-label { font-size:22px; font-weight:700; margin:8px 0; }
    .score-detail { color:var(--tf-text-secondary); font-size:14px; }
    .results-actions { display:flex; gap:12px; flex-wrap:wrap; }
    .topic-breakdown-row { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
    .tb-topic { min-width:120px; font-size:13px; }
    .tb-bar { flex:1; }
    .tf-progress-fill.low { background:linear-gradient(90deg, #ff4444, #ff6666); }
    .tb-pct { min-width:40px; text-align:right; font-size:13px; font-weight:700; }
    .tb-pct.low { color:var(--tf-error); }
    .jd-context-banner { background:rgba(0,212,255,0.08); border:1px solid var(--tf-border-glow); border-radius:var(--tf-radius-sm); padding:12px 18px; font-size:14px; color:var(--tf-primary); font-weight:600; margin-bottom:24px; text-align:center; }
  `]
})
export class McqTestComponent implements OnInit {
  phase: 'setup' | 'test' | 'results' = 'setup';
  questions: McqQuestion[] = [];
  currentIdx = 0;
  selectedAnswer = '';
  answered = false;
  correctCount = 0;
  loading = false;
  error = '';
  jdRecordId: number | null = null;
  optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  topicStats: { [key: string]: { correct: number; total: number } } = {};
  testConfig = { count: 15, difficulty: 'ADAPTIVE' };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    const saved = sessionStorage.getItem('currentJdId');
    if (saved) this.jdRecordId = parseInt(saved);
  }

  get currentQ(): McqQuestion { return this.questions[this.currentIdx]; }
  get scorePercent(): number { return this.questions.length > 0 ? (this.correctCount / this.questions.length) * 100 : 0; }

  startTest(): void {
    if (!this.jdRecordId) { this.error = 'Please upload and analyze a JD first from the JD Analysis page.'; return; }
    this.loading = true; this.error = '';
    this.apiService.generateMcq({ jdRecordId: this.jdRecordId, ...this.testConfig }).subscribe({
      next: (res) => {
        const data = res.data || res;
        this.questions = data.questions || [];
        if (!this.questions.length) { this.error = 'No questions generated. Please try again.'; this.loading = false; return; }
        this.phase = 'test'; this.currentIdx = 0; this.correctCount = 0; this.topicStats = {};
        this.loading = false;
      },
      error: (err) => { this.error = err?.error?.message || 'Failed to generate MCQ. Please try again.'; this.loading = false; }
    });
  }

  selectAnswer(opt: string): void {
    if (this.answered) return;
    this.selectedAnswer = opt;
    this.answered = true;
    const isCorrect = opt === this.currentQ.correct_answer;
    if (isCorrect) this.correctCount++;
    const topic = this.currentQ.topic || 'General';
    if (!this.topicStats[topic]) this.topicStats[topic] = { correct: 0, total: 0 };
    this.topicStats[topic].total++;
    if (isCorrect) this.topicStats[topic].correct++;
  }

  nextQuestion(): void {
    this.currentIdx++;
    this.selectedAnswer = '';
    this.answered = false;
  }

  finishTest(): void {
    this.phase = 'results';
    sessionStorage.setItem('topicStats', JSON.stringify(this.topicStats));
    sessionStorage.setItem('mcqScore', String(this.scorePercent));
  }

  resetTest(): void { this.phase = 'setup'; this.questions = []; this.currentIdx = 0; this.correctCount = 0; this.topicStats = {}; }

  getScoreLabel(): string {
    if (this.scorePercent >= 80) return '⭐ Outstanding!';
    if (this.scorePercent >= 60) return '🟢 Good Performance';
    if (this.scorePercent >= 40) return '🟡 Needs Improvement';
    return '🔴 Needs Reinforcement';
  }
}
