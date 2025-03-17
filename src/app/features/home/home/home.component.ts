import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { QuestionService } from '../../../core/services/question/question.service';
import { Question } from '../../../core/models/question.model';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CreateQuestionModalComponent } from '../create-question-modal/create-question-modal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    CreateQuestionModalComponent,
    InfiniteScrollModule
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  questions: Question[] = [];
  locationError: string | null = null;
  isLoading: boolean = false;
  currentUser: User | null = null;
  isQuestionModalOpen: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  scrollLoadin: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const userSub = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.subscriptions.add(userSub);

    this.loadQuestions();
  }

  loadQuestions(): void {
    if (this.isLoading || this.currentPage > this.totalPages) return;

    this.isLoading = true;
    this.questionService.fetchQuestions(this.currentPage).subscribe({
      next: (response) => {
        this.questions = [...this.questions, ...response.questions];
        this.totalPages = response.totalPages;
        this.currentPage++;
      },
      error: (error) => {
        console.error('Error fetching questions:', error);
        this.locationError = 'Failed to load questions. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onScroll(): void {
    this.scrollLoadin = true;
    setTimeout(() => {
      this.loadQuestions()
      this.scrollLoadin = false;
    }, 1500)

  }

  toggleLike(event: Event): void {
    event.stopPropagation();
    // this.questionService.toggleLike(question.id).subscribe()
  }

  navigateToNewQuestion(): void {
    this.openQuestionModal();
  }

  openQuestionModal(): void {
    this.isQuestionModalOpen = true;
  }

  closeQuestionModal(): void {
    this.isQuestionModalOpen = false;
  }

  handleQuestionCreated(): void {
    this.loadQuestions()
  }
}
