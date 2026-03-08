import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="register-page">
      <div class="bg-orbs">
        <div class="orb orb-1"></div><div class="orb orb-2"></div>
      </div>
      <div class="register-container">
        <div class="reg-logo">
          <span class="tf-gradient-text">⚡ TALENTFORGE</span>
          <span class="reg-logo-sub">Create Your Account</span>
        </div>

        <!-- Stepper -->
        <div class="tf-stepper">
          <div *ngFor="let s of stepLabels; let i = index" class="tf-step"
               [class.active]="currentStep === i + 1"
               [class.completed]="currentStep > i + 1">
            <div class="tf-step-dot">{{ currentStep > i + 1 ? '✓' : i + 1 }}</div>
            <div class="tf-step-label">{{ s }}</div>
          </div>
        </div>

        <div class="tf-card reg-card tf-fade-in">
          <div *ngIf="error" class="tf-alert tf-alert-error">⚠️ {{ error }}</div>

          <!-- Step 1: Personal -->
          <div *ngIf="currentStep === 1">
            <h3 class="step-title">👤 Personal Details</h3>
            <div class="tf-grid-2">
              <div class="tf-form-group">
                <label class="tf-label">Full Name *</label>
                <input class="tf-input" [(ngModel)]="form.fullName" placeholder="John Doe" required>
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Email *</label>
                <input class="tf-input" type="email" [(ngModel)]="form.email" placeholder="john@example.com" required>
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Password *</label>
                <input class="tf-input" type="password" [(ngModel)]="form.password" placeholder="Min 8 chars" required>
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Phone</label>
                <input class="tf-input" [(ngModel)]="form.phone" placeholder="+91 98765 43210">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Date of Birth</label>
                <input class="tf-input" type="date" [(ngModel)]="form.dateOfBirth">
              </div>
            </div>
          </div>

          <!-- Step 2: Education -->
          <div *ngIf="currentStep === 2">
            <h3 class="step-title">🎓 Education</h3>
            <div class="tf-grid-2">
              <div class="tf-form-group">
                <label class="tf-label">Degree</label>
                <select class="tf-select" [(ngModel)]="form.degree">
                  <option value="">Select degree</option>
                  <option>B.Tech / B.E.</option>
                  <option>B.Sc. Computer Science</option>
                  <option>MCA</option>
                  <option>M.Tech</option>
                  <option>MBA</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Institution</label>
                <input class="tf-input" [(ngModel)]="form.institution" placeholder="IIT Mumbai / VIT / etc.">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Graduation Year</label>
                <input class="tf-input" type="number" [(ngModel)]="form.graduationYear" placeholder="2023">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Major</label>
                <input class="tf-input" [(ngModel)]="form.major" placeholder="Computer Science">
              </div>
            </div>
          </div>

          <!-- Step 3: Professional -->
          <div *ngIf="currentStep === 3">
            <h3 class="step-title">💼 Professional Details</h3>
            <div class="tf-grid-2">
              <div class="tf-form-group">
                <label class="tf-label">Current Role</label>
                <input class="tf-input" [(ngModel)]="form.currentRole" placeholder="Software Engineer">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Company</label>
                <input class="tf-input" [(ngModel)]="form.company" placeholder="TechCorp Ltd">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Years of Experience</label>
                <input class="tf-input" type="number" [(ngModel)]="form.yearsOfExperience" placeholder="2.5">
              </div>
              <div class="tf-form-group" style="grid-column: 1 / -1">
                <label class="tf-label">Past Roles (comma-separated)</label>
                <input class="tf-input" [(ngModel)]="form.pastRoles" placeholder="Junior Dev at ABC, Intern at XYZ">
              </div>
            </div>
          </div>

          <!-- Step 4: Skills -->
          <div *ngIf="currentStep === 4">
            <h3 class="step-title">⚡ Skills & Preferences</h3>
            <div class="tf-form-group">
              <label class="tf-label">Technical Skills (comma-separated)</label>
              <input class="tf-input" [(ngModel)]="form.technicalSkills" placeholder="Java, Spring Boot, Angular, Python, SQL">
            </div>
            <div class="tf-form-group">
              <label class="tf-label">Soft Skills</label>
              <input class="tf-input" [(ngModel)]="form.softSkills" placeholder="Communication, Leadership, Problem Solving">
            </div>
            <div class="tf-grid-2">
              <div class="tf-form-group">
                <label class="tf-label">Preferred Role</label>
                <input class="tf-input" [(ngModel)]="form.preferredRole" placeholder="Senior Software Engineer">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Preferred Location</label>
                <input class="tf-input" [(ngModel)]="form.preferredLocation" placeholder="Bangalore, India">
              </div>
            </div>
            <div class="tf-form-group">
              <label class="tf-label">Career Goal</label>
              <textarea class="tf-textarea" [(ngModel)]="form.careerGoal"
                        placeholder="Describe your short and long term career goals..." rows="3"></textarea>
            </div>
          </div>

          <!-- Step 5: Consent -->
          <div *ngIf="currentStep === 5">
            <h3 class="step-title">🔒 Privacy & Consent</h3>
            <p class="step-desc">Before we create your account, please review and accept our terms.</p>

            <div class="consent-card">
              <div class="tf-check-group">
                <input type="checkbox" [(ngModel)]="form.dataPrivacyAgreed" id="privacy">
                <label for="privacy">
                  <strong>Data Privacy Agreement</strong> — I agree that TalentForge may store my personal information, resume data, and assessment results to provide the AI preparation service.
                </label>
              </div>
            </div>
            <div class="consent-card" style="margin-top:14px">
              <div class="tf-check-group">
                <input type="checkbox" [(ngModel)]="form.aiProcessingConsent" id="ai">
                <label for="ai">
                  <strong>AI Processing Consent</strong> — I consent to my data being processed by ForgeAI (powered by Gemini) for generating personalized interview questions, evaluations, and career insights.
                </label>
              </div>
            </div>

            <div *ngIf="!form.dataPrivacyAgreed || !form.aiProcessingConsent" class="tf-alert tf-alert-warning" style="margin-top:20px">
              ⚠️ You must accept both agreements to create your account.
            </div>
          </div>

          <!-- Navigation -->
          <div class="step-nav">
            <button *ngIf="currentStep > 1" class="tf-btn tf-btn-ghost" (click)="prevStep()">← Back</button>
            <div style="flex:1"></div>
            <button *ngIf="currentStep < 5" class="tf-btn tf-btn-primary" (click)="nextStep()">
              Next Step →
            </button>
            <button *ngIf="currentStep === 5" class="tf-btn tf-btn-primary"
                    (click)="onSubmit()" [disabled]="loading || !form.dataPrivacyAgreed || !form.aiProcessingConsent">
              <span *ngIf="loading" class="spinner"></span>
              {{ loading ? 'Creating Account...' : '🚀 Create Account' }}
            </button>
          </div>
        </div>

        <p class="login-link">
          Already have an account? <a routerLink="/login" class="link-primary">Sign in</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .register-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: var(--tf-bg); padding: 40px 20px; position: relative; overflow: hidden;
    }
    .bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; animation: float 6s ease-in-out infinite; }
    .orb-1 { width: 500px; height: 500px; background: #00d4ff; top: -150px; right: -100px; }
    .orb-2 { width: 350px; height: 350px; background: #a855f7; bottom: -100px; left: -50px; animation-delay: -3s; }

    .register-container { position: relative; z-index: 1; width: 100%; max-width: 680px; }
    .reg-logo { text-align: center; margin-bottom: 28px; }
    .reg-logo > span:first-child { font-size: 22px; font-weight: 900; letter-spacing: 3px; display: block; }
    .reg-logo-sub { font-size: 13px; color: var(--tf-text-secondary); display: block; margin-top: 4px; }

    .reg-card { padding: 36px; }
    .step-title { font-size: 20px; font-weight: 800; margin-bottom: 24px; }
    .step-desc { color: var(--tf-text-secondary); font-size: 14px; margin-bottom: 24px; line-height: 1.6; }

    .consent-card {
      background: var(--tf-card); border: 1px solid var(--tf-border);
      border-radius: var(--tf-radius-sm); padding: 18px;
    }
    .tf-check-group label { font-size: 14px; color: var(--tf-text-secondary); line-height: 1.6; cursor: pointer; }

    .step-nav { display: flex; align-items: center; margin-top: 28px; gap: 12px; }

    .login-link { text-align: center; color: var(--tf-text-secondary); font-size: 14px; margin-top: 20px; }
    .link-primary { color: var(--tf-primary); text-decoration: none; font-weight: 600; }
  `]
})
export class RegisterComponent {
    currentStep = 1;
    stepLabels = ['Personal', 'Education', 'Professional', 'Skills', 'Consent'];
    loading = false;
    error = '';

    form: any = {
        fullName: '', email: '', password: '', phone: '', dateOfBirth: '',
        degree: '', institution: '', graduationYear: null, major: '',
        currentRole: '', company: '', yearsOfExperience: null, pastRoles: '',
        technicalSkills: '', softSkills: '', preferredRole: '', preferredLocation: '',
        careerGoal: '', dataPrivacyAgreed: false, aiProcessingConsent: false
    };

    constructor(private authService: AuthService, private router: Router) { }

    nextStep(): void {
        if (this.currentStep === 1 && (!this.form.fullName || !this.form.email || !this.form.password)) {
            this.error = 'Full name, email, and password are required.';
            return;
        }
        this.error = '';
        this.currentStep++;
    }

    prevStep(): void {
        this.error = '';
        this.currentStep--;
    }

    onSubmit(): void {
        if (!this.form.dataPrivacyAgreed || !this.form.aiProcessingConsent) return;
        this.loading = true;
        this.error = '';
        this.authService.register(this.form).subscribe({
            next: (res) => {
                if (res.status === 'SUCCESS') {
                    this.router.navigate(['/verify-otp'], { queryParams: { email: this.form.email } });
                } else {
                    this.error = res.message;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.message || 'Registration failed.';
                this.loading = false;
            }
        });
    }
}
