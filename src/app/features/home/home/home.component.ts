import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {catchError, finalize, map, Observable, of} from 'rxjs';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '../navbar/navbar.component';
import {QuestionService} from '../../../core/services/question/question.service';
import {Question} from '../../../core/models/question.model';
import {User} from '../../../core/models/user.model';
import {AuthService} from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    NavbarComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  questions$!: Observable<Question[]>;
  locationError: string | null = null;
  isLoading: boolean = true;
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    })
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.isLoading = true;
    this.questions$ = this.questionService.fetchQuestion().pipe(
      map(response => {
        // Ensure each question has the expected structure
        return (response.questions || []).map((question: Question) => {
          // Make sure likes is always an array
          if (!question.likes) question.likes = [];
          // Make sure answers is always an array
          if (!question.answers) question.answers = [];
          return question;
        });
      }),
      catchError(error => {
        console.error('Error fetching questions:', error);
        this.locationError = 'Failed to load questions. Please try again.';
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  toggleLike(event: Event): void {
    event.stopPropagation(); // Prevent navigation to question detail
    // this.questionService.toggleLike(question.id).subscribe()
  }

  navigateToQuestion(questionId: string): void {
    this.router.navigate(['/questions', questionId]);
  }

  navigateToNewQuestion(): void {
    console.log("navigateToNewQuestion");
  }
}
