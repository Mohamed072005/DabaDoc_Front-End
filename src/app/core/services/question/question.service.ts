import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {devEnvironment} from '../../../../environments/environment';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Question, QuestionFormData} from '../../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl: string = devEnvironment.apiUrl;
  constructor(private http: HttpClient) {}

  fetchQuestions(page: number = 1, perPage: number = 5): Observable<{ questions: Question[], totalPages: number, totalCount: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    return this.http.get<any>(`${this.apiUrl}/question/get/questions`, { params: params })
      .pipe(
        map(response => ({
          questions: response.data.questions,
          totalPages: response.data.total_pages,
          totalCount: response.data.total_count
        })),
        catchError(this.handleError)
      )
  }

  createQuestion(question: QuestionFormData, token: string): Observable<{ message: string, question: Question }> {
    const headers = new HttpHeaders({'Authorization': token});
    return this.http.post<{ message: string, question: Question }>(`${this.apiUrl}/question/create`, question, { headers: headers })
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
