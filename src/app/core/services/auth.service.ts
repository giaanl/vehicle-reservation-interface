import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  tap,
  map,
  catchError,
  of,
  throwError,
} from 'rxjs';
import { User } from '../models/user.model';
import {
  LoginRequest,
  AuthResponse,
  RegisterRequest,
} from '../../features/auth/models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private authCheckComplete = new BehaviorSubject<boolean>(false);
  authCheckComplete$ = this.authCheckComplete.asObservable();

  isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));

  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus();
    } else {
      this.authCheckComplete.next(true);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((res) => this.handleAuthSuccess(res)),
        catchError((err) => {
          console.error('Erro no login:', err);
          return throwError(() => err);
        }),
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(() => this.currentUserSubject.next(null)),
      catchError((err) => {
        console.error('Erro no registro:', err);
        return throwError(() => err);
      }),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
      tap(() => this.currentUserSubject.next(null)),
      catchError((err) => {
        this.currentUserSubject.next(null);
        console.error('Erro no logout:', err);
        return throwError(() => err);
      }),
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  checkAuthStatus(): void {
    this.http
      .get<{ user: User }>(`${this.API_URL}/me`)
      .pipe(
        tap((res) => this.currentUserSubject.next(res.user)),
        catchError(() => {
          this.currentUserSubject.next(null);
          return of(null);
        }),
      )
      .subscribe({
        next: () => this.authCheckComplete.next(true),
        error: () => this.authCheckComplete.next(true),
      });
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.currentUserSubject.next(response.user);
    this.authCheckComplete.next(true);
  }
}
