import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="login-page">
      <div class="bg-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </div>

      <div class="login-container">
        <!-- Logo -->
        <div class="login-logo">
          <div class="logo-mark">⚡</div>
          <span class="tf-gradient-text logo-brand">TALENTFORGE</span>
          <div class="logo-sub">Powered by ForgeAI</div>
        </div>

        <div class="login-card tf-card tf-fade-in">
          <h2 class="card-title">Welcome Back</h2>
          <p class="card-subtitle">Sign in to continue your preparation journey</p>

          <!-- Error -->
          <div *ngIf="error" class="tf-alert tf-alert-error">⚠️ {{ error }}</div>

          <form (ngSubmit)="onLogin()" #form="ngForm">
            <div class="tf-form-group">
              <label class="tf-label">Email / Username</label>
              <input type="text" class="tf-input" [(ngModel)]="email" name="email"
                     placeholder="your@email.com or TalentForgeAI" required>
            </div>
            <div class="tf-form-group">
              <label class="tf-label">Password</label>
              <div class="pass-wrapper">
                <input [type]="showPass ? 'text' : 'password'" class="tf-input"
                       [(ngModel)]="password" name="password" placeholder="Enter your password" required>
                <button type="button" class="pass-toggle" (click)="showPass = !showPass">
                  {{ showPass ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <button type="submit" class="tf-btn tf-btn-primary tf-btn-full tf-btn-lg" [disabled]="loading">
              <span *ngIf="loading" class="spinner"></span>
              <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </form>

          <div class="divider"><span>or use demo</span></div>

          <!-- Demo Credentials -->
          <div class="demo-creds">
            <div class="demo-cred" (click)="fillDemo('demo')">
              <span class="tf-badge tf-badge-primary">👤 Candidate</span>
              <code>demo&#64;talentforge.ai / Demo&#64;1234</code>
            </div>
            <div class="demo-cred" (click)="fillDemo('admin')">
              <span class="tf-badge tf-badge-purple">🛡️ Admin</span>
              <code>TalentForgeAI / ForgeAI&#64;1412</code>
            </div>
          </div>

          <p class="login-footer">
            Don't have an account?
            <a routerLink="/register" class="link-primary">Create one →</a>
          </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--tf-bg);
      position: relative;
      overflow: hidden;
    }
    .bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; animation: float 6s ease-in-out infinite; }
    .orb-1 { width: 500px; height: 500px; background: #00d4ff; top: -150px; left: -100px; }
    .orb-2 { width: 350px; height: 350px; background: #a855f7; bottom: -100px; right: -50px; animation-delay: -3s; }

    .login-container { position: relative; z-index: 1; width: 100%; max-width: 440px; padding: 20px; }

    .login-logo { text-align: center; margin-bottom: 32px; }
    .logo-mark { font-size: 40px; margin-bottom: 8px; }
    .logo-brand { font-size: 24px; font-weight: 900; letter-spacing: 4px; display: block; }
    .logo-sub { font-size: 12px; color: var(--tf-text-secondary); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }

    .login-card { padding: 36px; }
    .card-title { font-size: 24px; font-weight: 800; margin-bottom: 6px; }
    .card-subtitle { color: var(--tf-text-secondary); font-size: 14px; margin-bottom: 28px; }

    .pass-wrapper { position: relative; }
    .pass-toggle {
      position: absolute; right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none; cursor: pointer; font-size: 18px;
    }

    .divider {
      text-align: center; margin: 24px 0;
      position: relative;
    }
    .divider::before {
      content: ''; position: absolute; top: 50%; left: 0; right: 0;
      height: 1px; background: var(--tf-border);
    }
    .divider span {
      position: relative; background: var(--tf-bg-2);
      padding: 0 12px; font-size: 12px; color: var(--tf-text-secondary);
    }

    .demo-creds { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
    .demo-cred {
      display: flex; flex-direction: column; gap: 6px;
      padding: 12px 16px;
      background: rgba(0,212,255,0.05);
      border: 1px solid var(--tf-border-glow);
      border-radius: var(--tf-radius-sm);
      cursor: pointer; transition: all 0.2s ease;
    }
    .demo-cred:hover { background: rgba(0,212,255,0.1); }
    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; color: var(--tf-text-secondary);
    }

    .login-footer { text-align: center; font-size: 14px; color: var(--tf-text-secondary); margin-top: 20px; }
    .link-primary { color: var(--tf-primary); text-decoration: none; font-weight: 600; }
    .link-primary:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
    email = '';
    password = '';
    showPass = false;
    loading = false;
    error = '';

    constructor(private authService: AuthService, private router: Router) { }

    fillDemo(type: 'demo' | 'admin'): void {
        if (type === 'demo') {
            this.email = 'demo@talentforge.ai';
            this.password = 'Demo@1234';
        } else {
            this.email = 'TalentForgeAI';
            this.password = 'ForgeAI@1412';
        }
    }

    onLogin(): void {
        if (!this.email || !this.password) return;
        this.loading = true;
        this.error = '';
        this.authService.login(this.email, this.password).subscribe({
            next: (res) => {
                if (res.status === 'SUCCESS') {
                    const user = this.authService.getCurrentUser();
                    this.router.navigate([user?.role === 'ADMIN' ? '/admin' : '/dashboard']);
                } else {
                    this.error = res.message;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.message || 'Login failed. Please try again.';
                this.loading = false;
            }
        });
    }
}
