import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-otp',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="otp-page">
      <div class="bg-glow"></div>
      <div class="otp-container">
        <div class="otp-logo">
          <div class="otp-icon">📧</div>
          <span class="tf-gradient-text otp-brand">Verify Your Email</span>
          <p class="otp-desc">
            We sent a 6-digit code to<br>
            <strong>{{ email }}</strong>
          </p>
        </div>

        <div class="tf-card otp-card tf-fade-in">
          <div *ngIf="error" class="tf-alert tf-alert-error">⚠️ {{ error }}</div>
          <div *ngIf="success" class="tf-alert tf-alert-success">✅ {{ success }}</div>

          <div class="tf-form-group">
            <label class="tf-label tf-text-center">Enter 6-Digit OTP</label>
            <input class="tf-input otp-input" [(ngModel)]="otp" maxlength="6"
                   placeholder="• • • • • •" type="text" inputmode="numeric">
          </div>

          <button class="tf-btn tf-btn-primary tf-btn-full tf-btn-lg" (click)="onVerify()" [disabled]="loading || otp.length < 6">
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Verifying...' : '✅ Verify & Continue' }}
          </button>

          <div class="resend-row">
            <span style="color:var(--tf-text-secondary);font-size:14px">Didn't receive the code?</span>
            <button class="tf-btn tf-btn-ghost tf-btn-sm" (click)="onResend()" [disabled]="resendCooldown > 0">
              {{ resendCooldown > 0 ? 'Resend in ' + resendCooldown + 's' : 'Resend OTP' }}
            </button>
          </div>
        </div>

        <p style="text-align:center;margin-top:16px;color:var(--tf-text-secondary);font-size:13px">
          OTP expires in 10 minutes · Check spam folder if not received
        </p>
      </div>
    </div>
  `,
    styles: [`
    .otp-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: var(--tf-bg); position: relative; overflow: hidden;
    }
    .bg-glow {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 600px; height: 600px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,212,255,0.12), transparent 70%);
      pointer-events: none;
    }
    .otp-container { position: relative; z-index: 1; width: 100%; max-width: 420px; padding: 20px; }
    .otp-logo { text-align: center; margin-bottom: 28px; }
    .otp-icon { font-size: 48px; margin-bottom: 12px; }
    .otp-brand { font-size: 22px; font-weight: 800; display: block; margin-bottom: 8px; }
    .otp-desc { color: var(--tf-text-secondary); font-size: 14px; line-height: 1.6; }
    .otp-desc strong { color: var(--tf-primary); }

    .otp-card { padding: 32px; }
    .otp-input {
      text-align: center; font-size: 28px; letter-spacing: 16px;
      font-family: 'JetBrains Mono', monospace; font-weight: 700;
    }
    .resend-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--tf-border);
    }
  `]
})
export class OtpComponent implements OnInit {
    email = '';
    otp = '';
    loading = false;
    error = '';
    success = '';
    resendCooldown = 0;
    private cooldownTimer: any;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.email = this.route.snapshot.queryParamMap.get('email') || '';
        if (!this.email) this.router.navigate(['/register']);
    }

    onVerify(): void {
        if (this.otp.length < 6) return;
        this.loading = true; this.error = '';
        this.authService.verifyOtp(this.email, this.otp).subscribe({
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
                this.error = err?.error?.message || 'Verification failed.';
                this.loading = false;
            }
        });
    }

    onResend(): void {
        if (this.resendCooldown > 0) return;
        this.authService.resendOtp(this.email).subscribe({
            next: (res) => {
                if (res.status === 'SUCCESS') {
                    this.success = 'New OTP sent! Check your email.';
                    this.startCooldown();
                } else {
                    this.error = res.message;
                }
            },
            error: () => { this.error = 'Failed to resend OTP.'; }
        });
    }

    private startCooldown(): void {
        this.resendCooldown = 60;
        this.cooldownTimer = setInterval(() => {
            this.resendCooldown--;
            if (this.resendCooldown <= 0) clearInterval(this.cooldownTimer);
        }, 1000);
    }
}
