import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
    { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
    { path: 'verify-otp', loadComponent: () => import('./pages/auth/otp/otp.component').then(m => m.OtpComponent) },
    { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },

    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'jd-upload',
        loadComponent: () => import('./pages/jd-upload/jd-upload.component').then(m => m.JdUploadComponent),
        canActivate: [authGuard]
    },
    {
        path: 'learning',
        loadComponent: () => import('./pages/learning/learning.component').then(m => m.LearningComponent),
        canActivate: [authGuard]
    },
    {
        path: 'mcq-test',
        loadComponent: () => import('./pages/mcq-test/mcq-test.component').then(m => m.McqTestComponent),
        canActivate: [authGuard]
    },
    {
        path: 'weak-areas',
        loadComponent: () => import('./pages/weak-areas/weak-areas.component').then(m => m.WeakAreasComponent),
        canActivate: [authGuard]
    },
    {
        path: 'readiness',
        loadComponent: () => import('./pages/readiness/readiness.component').then(m => m.ReadinessComponent),
        canActivate: [authGuard]
    },
    {
        path: 'career-insights',
        loadComponent: () => import('./pages/career-insights/career-insights.component').then(m => m.CareerInsightsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'report',
        loadComponent: () => import('./pages/report/report.component').then(m => m.ReportComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [adminGuard]
    },

    { path: '**', redirectTo: '' }
];
