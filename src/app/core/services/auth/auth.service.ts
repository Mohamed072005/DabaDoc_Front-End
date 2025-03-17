import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {devEnvironment} from '../../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {User} from '../../models/user.model';
import {isPlatformBrowser} from '@angular/common';

interface RegisterData {
  email: string
  password: string
  password_confirmation: string
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string = devEnvironment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadStoredUserData()
  }

  private loadStoredUserData(): void {
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user data:', e);
          this.clearStoredData();
        }
      }

      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.tokenSubject.next(storedToken);
      }
    }
  }

  register(userData: RegisterData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(userData: LoginData): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, userData)
      .pipe(
        tap((response: AuthResponse) => this.handleAuthResponse(response)),
        catchError(this.handleError)
      )
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (this.isBrowser && response?.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      this.currentUserSubject.next(response.data.user);
      this.tokenSubject.next(response.data.token);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.error;
    }else {
      errorMessage = error.error.error || `Error Code: ${error.status}, Message: ${error.error}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    this.clearAuthData();
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  private clearAuthData(): void {
    if (this.isBrowser) {
      this.clearStoredData();
    }
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  private clearStoredData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
}
