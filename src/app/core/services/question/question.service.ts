import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {devEnvironment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl: string = devEnvironment.apiUrl;
  constructor(private http: HttpClient) {}

  fetchQuestion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/question/get/questions`)
  }
}
