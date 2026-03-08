import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly BASE = '/api';

    constructor(private http: HttpClient) { }

    // JD
    analyzeJd(jdText: string, jobTitle: string): Observable<any> {
        return this.http.post(`${this.BASE}/jd/analyze`, { jdText, jobTitle });
    }
    getJdHistory(): Observable<any> {
        return this.http.get(`${this.BASE}/jd/history`);
    }
    getJdById(id: number): Observable<any> {
        return this.http.get(`${this.BASE}/jd/${id}`);
    }

    // Learning
    generateQuestions(payload: any): Observable<any> {
        return this.http.post(`${this.BASE}/learning/generate-questions`, payload);
    }
    generateLearningContent(payload: any): Observable<any> {
        return this.http.post(`${this.BASE}/learning/generate-content`, payload);
    }
    generateInterrogation(payload: any): Observable<any> {
        return this.http.post(`${this.BASE}/learning/interrogate`, payload);
    }
    generateMcq(payload: any): Observable<any> {
        return this.http.post(`${this.BASE}/learning/generate-mcq`, payload);
    }
    detectWeakAreas(payload: any): Observable<any> {
        return this.http.post(`${this.BASE}/learning/detect-weak`, payload);
    }
    getReinforcement(payload: any): Observable<any> {
        return this.http.post(`${this.BASE}/learning/reinforce`, payload);
    }

    // Readiness
    calculateReadiness(payload: any): Observable<any> {
        return this.http.post(`${this.BASE}/readiness/calculate`, payload);
    }
    getLatestReadiness(): Observable<any> {
        return this.http.get(`${this.BASE}/readiness/latest`);
    }
    getReadinessHistory(): Observable<any> {
        return this.http.get(`${this.BASE}/readiness/history`);
    }
    getDashboard(): Observable<any> {
        return this.http.get(`${this.BASE}/readiness/dashboard`);
    }
    getCareerInsights(payload: any): Observable<any> {
        return this.http.post(`${this.BASE}/readiness/career-insights`, payload);
    }

    // User
    getProfile(): Observable<any> {
        return this.http.get(`${this.BASE}/users/me`);
    }
    updateProfile(data: any): Observable<any> {
        return this.http.put(`${this.BASE}/users/profile`, data);
    }

    // Admin
    getAllUsers(): Observable<any> {
        return this.http.get(`${this.BASE}/admin/users`);
    }
    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.BASE}/admin/users/${userId}`);
    }
    getAiLogs(): Observable<any> {
        return this.http.get(`${this.BASE}/admin/ai-logs`);
    }
    getAnalytics(): Observable<any> {
        return this.http.get(`${this.BASE}/admin/analytics`);
    }

    // PDF
    downloadReport(): Observable<Blob> {
        return this.http.get(`${this.BASE}/pdf/report`, { responseType: 'blob' });
    }
}
