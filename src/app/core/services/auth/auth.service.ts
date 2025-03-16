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
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser){
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
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
        tap((response: AuthResponse) => {
          if (this.isBrowser) {
            // Save the token and user to localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            // Update the currentUserSubject
            this.currentUserSubject.next(response.data.user);
          }
        }),
        catchError(this.handleError)
      )
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
    if (this.isBrowser){
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }
}
