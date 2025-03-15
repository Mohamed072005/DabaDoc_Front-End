import {Injectable} from '@angular/core';
import {devEnvironment} from '../../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

interface RegisterData {
  email: string
  password: string
  password_confirmation: string
}

interface LoginData {
  email: string
  password: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string = devEnvironment.apiUrl;
  constructor(private http: HttpClient) {}

  register(userData: RegisterData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(userData: LoginData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, userData)
      .pipe(
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
}
