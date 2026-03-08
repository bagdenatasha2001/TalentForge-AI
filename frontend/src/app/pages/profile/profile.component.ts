import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="tf-page">
      <nav class="tf-sidebar">
        <div class="tf-sidebar-logo"><div class="logo-text">⚡ TALENTFORGE</div></div>
        <div class="tf-sidebar-content">
          <a class="tf-nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span> Dashboard</a>
          <a class="tf-nav-item active" routerLink="/profile"><span class="nav-icon">👤</span> Profile</a>
          <a class="tf-nav-item" routerLink="/readiness"><span class="nav-icon">🏆</span> Readiness</a>
          <a class="tf-nav-item" routerLink="/report"><span class="nav-icon">📊</span> Report</a>
        </div>
      </nav>

      <main class="tf-main with-sidebar">
        <div class="tf-page-header">
          <h1 class="tf-page-title">👤 Your Profile</h1>
          <p class="tf-page-subtitle">Manage your candidate profile and preferences</p>
        </div>

        <div *ngIf="loading" class="tf-loading"><div class="tf-spinner"></div></div>

        <div *ngIf="!loading && user" class="tf-fade-in">
          <!-- Profile Hero -->
          <div class="tf-card profile-hero tf-mb-6">
            <div class="avatar-large">{{ user.fullName?.charAt(0)?.toUpperCase() || 'U' }}</div>
            <div class="profile-main">
              <h2 class="profile-name">{{ user.fullName }}</h2>
              <div class="profile-meta">
                <span class="tf-badge tf-badge-primary">{{ user.role }}</span>
                <span class="tf-badge tf-badge-success" *ngIf="user.emailVerified">✅ Verified</span>
              </div>
              <div class="profile-details">
                <span class="pd-item"><span class="pd-icon">📧</span>{{ user.email }}</span>
                <span class="pd-item" *ngIf="user.currentRole"><span class="pd-icon">💼</span>{{ user.currentRole }}</span>
                <span class="pd-item" *ngIf="user.company"><span class="pd-icon">🏢</span>{{ user.company }}</span>
                <span class="pd-item" *ngIf="user.yearsOfExperience"><span class="pd-icon">⏱️</span>{{ user.yearsOfExperience }} years exp.</span>
              </div>
            </div>
          </div>

          <!-- Edit Form -->
          <div class="tf-card">
            <div class="form-header tf-mb-6">
              <h3 class="form-title">Edit Profile</h3>
              <button class="tf-btn tf-btn-primary tf-btn-sm" (click)="save()" [disabled]="saving">
                <span *ngIf="saving" class="spinner"></span>
                {{ saving ? 'Saving...' : '💾 Save Changes' }}
              </button>
            </div>

            <div *ngIf="success" class="tf-alert tf-alert-success">✅ {{ success }}</div>
            <div *ngIf="error" class="tf-alert tf-alert-error">⚠️ {{ error }}</div>

            <div class="tf-grid-2">
              <div class="tf-form-group">
                <label class="tf-label">Full Name</label>
                <input class="tf-input" [(ngModel)]="form.fullName" placeholder="Full Name">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Phone</label>
                <input class="tf-input" [(ngModel)]="form.phone" placeholder="+91 98765 43210">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Current Role</label>
                <input class="tf-input" [(ngModel)]="form.currentRole" placeholder="Senior Software Engineer">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Company</label>
                <input class="tf-input" [(ngModel)]="form.company" placeholder="Company Name">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Years of Experience</label>
                <input class="tf-input" type="number" [(ngModel)]="form.yearsOfExperience" placeholder="3.5">
              </div>
              <div class="tf-form-group">
                <label class="tf-label">Preferred Role</label>
                <input class="tf-input" [(ngModel)]="form.preferredRole" placeholder="Tech Lead">
              </div>
              <div class="tf-form-group" style="grid-column:1/-1">
                <label class="tf-label">Technical Skills</label>
                <input class="tf-input" [(ngModel)]="form.technicalSkills" placeholder="Java, Spring Boot, Angular, SQL, Docker">
              </div>
              <div class="tf-form-group" style="grid-column:1/-1">
                <label class="tf-label">Career Goal</label>
                <textarea class="tf-textarea" [(ngModel)]="form.careerGoal" rows="3"
                          placeholder="Describe your career goals..."></textarea>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .profile-hero { display:flex; gap:28px; align-items:flex-start; flex-wrap:wrap; }
    .avatar-large { width:80px; height:80px; border-radius:50%; background:var(--tf-grad-brand); display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:800; color:#000; flex-shrink:0; }
    .profile-main { flex:1; }
    .profile-name { font-size:22px; font-weight:800; margin-bottom:10px; }
    .profile-meta { display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
    .profile-details { display:flex; gap:20px; flex-wrap:wrap; }
    .pd-item { font-size:13px; color:var(--tf-text-secondary); display:flex; align-items:center; gap:6px; }
    .pd-icon { }
    .form-header { display:flex; justify-content:space-between; align-items:center; }
    .form-title { font-size:16px; font-weight:700; }
  `]
})
export class ProfileComponent implements OnInit {
    user: any = null;
    loading = true;
    saving = false;
    error = '';
    success = '';
    form: any = {};

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        this.apiService.getProfile().subscribe({
            next: (res) => {
                if (res.status === 'SUCCESS' && res.data) {
                    this.user = res.data;
                    this.form = {
                        fullName: this.user.fullName,
                        phone: this.user.phone,
                        currentRole: this.user.currentRole,
                        company: this.user.company,
                        yearsOfExperience: this.user.yearsOfExperience,
                        preferredRole: this.user.preferredRole,
                        technicalSkills: this.user.technicalSkills,
                        careerGoal: this.user.careerGoal,
                    };
                }
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    save(): void {
        this.saving = true; this.error = ''; this.success = '';
        this.apiService.updateProfile(this.form).subscribe({
            next: (res) => {
                if (res.status === 'SUCCESS') {
                    this.user = { ...this.user, ...this.form };
                    this.success = 'Profile updated successfully!';
                } else { this.error = res.message; }
                this.saving = false;
            },
            error: () => { this.error = 'Failed to save profile.'; this.saving = false; }
        });
    }
}
