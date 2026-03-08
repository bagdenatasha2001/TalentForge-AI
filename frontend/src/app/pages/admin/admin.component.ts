import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="tf-page">
      <nav class="tf-sidebar">
        <div class="tf-sidebar-logo">
          <div class="logo-text">⚡ TALENTFORGE</div>
          <div class="logo-sub">Admin Panel</div>
        </div>
        <div class="tf-sidebar-content">
          <a class="tf-nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span> Dashboard</a>
          <a class="tf-nav-item active" routerLink="/admin"><span class="nav-icon">🛡️</span> Admin Panel</a>
        </div>
        <div class="tf-sidebar-footer">
          <button class="tf-btn tf-btn-ghost tf-btn-sm tf-btn-full" (click)="logout()">🚪 Sign Out</button>
        </div>
      </nav>

      <main class="tf-main with-sidebar">
        <div class="tf-page-header">
          <h1 class="tf-page-title">🛡️ Admin Control Panel</h1>
          <p class="tf-page-subtitle">TalentForge platform management · ADMIN access only</p>
        </div>

        <!-- Tabs -->
        <div class="admin-tabs tf-mb-6">
          <button *ngFor="let tab of tabs" class="tab-btn" [class.active]="activeTab === tab.key" (click)="activeTab = tab.key">
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <!-- Analytics Tab -->
        <div *ngIf="activeTab === 'analytics'" class="tf-fade-in">
          <div class="tf-grid-4 tf-mb-6">
            <div class="analytics-card tf-card">
              <div class="ac-icon">👥</div>
              <div class="ac-val tf-gradient-text">{{ analytics?.totalUsers || 0 }}</div>
              <div class="ac-label">Total Users</div>
            </div>
            <div class="analytics-card tf-card">
              <div class="ac-icon">🤖</div>
              <div class="ac-val tf-gradient-text">{{ analytics?.aiInteractions || 0 }}</div>
              <div class="ac-label">AI Interactions</div>
            </div>
            <div class="analytics-card tf-card">
              <div class="ac-icon">⚡</div>
              <div class="ac-val tf-gradient-text">ForgeAI</div>
              <div class="ac-label">Engine Status</div>
            </div>
            <div class="analytics-card tf-card">
              <div class="ac-icon">🟢</div>
              <div class="ac-val tf-gradient-text">Online</div>
              <div class="ac-label">System Status</div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div *ngIf="activeTab === 'users'" class="tf-fade-in">
          <div class="tf-card">
            <div class="tab-header">
              <h3>All Registered Users</h3>
              <span class="tf-badge tf-badge-primary">{{ users.length }} total</span>
            </div>
            <div *ngIf="loading" class="tf-loading"><div class="tf-spinner"></div></div>
            <table *ngIf="!loading" class="tf-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let u of users">
                  <td>
                    <div class="user-cell">
                      <div class="tf-avatar" style="width:32px;height:32px;font-size:12px">{{ u.fullName?.charAt(0) || '?' }}</div>
                      <span style="font-size:14px">{{ u.fullName }}</span>
                    </div>
                  </td>
                  <td style="font-size:13px;color:var(--tf-text-secondary)">{{ u.email }}</td>
                  <td>
                    <span class="tf-badge" [class]="u.role === 'ADMIN' ? 'tf-badge-purple' : 'tf-badge-primary'">
                      {{ u.role }}
                    </span>
                  </td>
                  <td>
                    <span class="tf-badge" [class]="u.emailVerified ? 'tf-badge-success' : 'tf-badge-warning'">
                      {{ u.emailVerified ? '✅ Verified' : '⏳ Pending' }}
                    </span>
                  </td>
                  <td>
                    <button class="tf-btn tf-btn-danger tf-btn-sm" (click)="deleteUser(u.id)"
                            [disabled]="u.role === 'ADMIN'" title="Cannot delete admin">
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- AI Logs Tab -->
        <div *ngIf="activeTab === 'logs'" class="tf-fade-in">
          <div class="tf-card">
            <div class="tab-header">
              <h3>Recent AI Interactions</h3>
              <span class="tf-badge tf-badge-primary">Last 50</span>
            </div>
            <div *ngIf="loading" class="tf-loading"><div class="tf-spinner"></div></div>
            <table *ngIf="!loading" class="tf-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>User ID</th>
                  <th>Status</th>
                  <th>Time (ms)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let log of aiLogs">
                  <td><code style="font-size:12px;color:var(--tf-primary)">{{ log.endpoint }}</code></td>
                  <td style="font-size:13px">{{ log.userId }}</td>
                  <td>
                    <span class="tf-badge" [class]="log.success ? 'tf-badge-success' : 'tf-badge-error'">
                      {{ log.success ? '✅ OK' : '❌ Error' }}
                    </span>
                  </td>
                  <td style="font-size:13px;font-family:'JetBrains Mono',monospace">{{ log.processingTimeMs }}ms</td>
                  <td style="font-size:12px;color:var(--tf-text-secondary)">{{ log.createdAt | date:'MMM dd HH:mm' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .admin-tabs { display:flex; gap:8px; flex-wrap:wrap; }
    .tab-btn { padding:10px 20px; border-radius:var(--tf-radius-sm); background:var(--tf-card); border:1px solid var(--tf-border); cursor:pointer; font-size:14px; font-family:'Inter',sans-serif; color:var(--tf-text-secondary); transition:all 0.2s; }
    .tab-btn.active { background:var(--tf-primary-glow); border-color:var(--tf-border-glow); color:var(--tf-primary); font-weight:600; }
    .analytics-card { text-align:center; padding:28px; }
    .ac-icon { font-size:28px; margin-bottom:10px; }
    .ac-val { font-size:32px; font-weight:900; display:block; }
    .ac-label { font-size:12px; color:var(--tf-text-secondary); text-transform:uppercase; letter-spacing:1px; margin-top:4px; }
    .tab-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
    .tab-header h3 { font-size:15px; font-weight:700; }
    .user-cell { display:flex; align-items:center; gap:10px; }
  `]
})
export class AdminComponent implements OnInit {
    activeTab = 'analytics';
    tabs = [
        { key: 'analytics', label: 'Analytics', icon: '📈' },
        { key: 'users', label: 'Users', icon: '👥' },
        { key: 'logs', label: 'AI Logs', icon: '🤖' },
    ];
    users: any[] = [];
    aiLogs: any[] = [];
    analytics: any = null;
    loading = false;

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        this.loadAnalytics();
        this.loadUsers();
        this.loadLogs();
    }

    loadAnalytics(): void {
        this.apiService.getAnalytics().subscribe({
            next: (res) => { if (res.status === 'SUCCESS') this.analytics = res.data; },
            error: () => { }
        });
    }

    loadUsers(): void {
        this.loading = true;
        this.apiService.getAllUsers().subscribe({
            next: (res) => { if (res.status === 'SUCCESS') this.users = res.data || []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    loadLogs(): void {
        this.apiService.getAiLogs().subscribe({
            next: (res) => { if (res.status === 'SUCCESS') this.aiLogs = res.data || []; },
            error: () => { }
        });
    }

    deleteUser(userId: number): void {
        if (!confirm('Delete this user and all their data?')) return;
        this.apiService.deleteUser(userId).subscribe({
            next: () => { this.users = this.users.filter(u => u.id !== userId); },
            error: () => { }
        });
    }

    logout(): void { this.authService.logout(); }
}
