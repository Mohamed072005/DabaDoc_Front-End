import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {devEnvironment} from '../../../../environments/environment';
import {catchError, Observable, throwError} from 'rxjs';
import {Question, QuestionFormData} from '../../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl: string = devEnvironment.apiUrl;
  constructor(private http: HttpClient) {}

  fetchQuestion(): Observable<{questions: Question[]}> {
    return this.http.get<{questions: Question[]}>(`${this.apiUrl}/question/get/questions`)
      .pipe(
        catchError(this.handleError)
      )
  }

  createQuestion(question: QuestionFormData, token: string): Observable<Question> {
    const headers = new HttpHeaders({'Authorization': token});
    return this.http.post<Question>(`${this.apiUrl}/question/create`, question, { headers: headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.error}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
    }
    return throwError(() => errorMessage);
  }
}
