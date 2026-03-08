import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthUser {
    userId: number;
    email: string;
    fullName: string;
    role: string;
    token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly TOKEN_KEY = 'tf_token';
    private readonly USER_KEY = 'tf_user';
    private readonly API_BASE = '/api/auth';

    private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    register(data: any): Observable<any> {
        return this.http.post(`${this.API_BASE}/register`, data);
    }

    verifyOtp(email: string, otp: string): Observable<any> {
        return this.http.post(`${this.API_BASE}/verify-otp`, { email, otp }).pipe(
            tap((res: any) => {
                if (res.status === 'SUCCESS' && res.data) {
                    this.storeSession(res.data);
                }
            })
        );
    }

    resendOtp(email: string): Observable<any> {
        return this.http.post(`${this.API_BASE}/resend-otp`, { email });
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post(`${this.API_BASE}/login`, { email, password }).pipe(
            tap((res: any) => {
                if (res.status === 'SUCCESS' && res.data) {
                    this.storeSession(res.data);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return user?.role === 'ADMIN';
    }

    getCurrentUser(): AuthUser | null {
        return this.currentUserSubject.value;
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private storeSession(data: AuthUser): void {
        localStorage.setItem(this.TOKEN_KEY, data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(data));
        this.currentUserSubject.next(data);
    }

    private loadUser(): AuthUser | null {
        try {
            const stored = localStorage.getItem(this.USER_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }
}
