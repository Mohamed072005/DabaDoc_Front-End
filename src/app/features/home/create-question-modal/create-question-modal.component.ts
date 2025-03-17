import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {QuestionService} from '../../../core/services/question/question.service';
import {Question, QuestionFormData} from '../../../core/models/question.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-create-question-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-question-modal.component.html',
  styleUrl: './create-question-modal.component.css'
})
export class CreateQuestionModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() questionCreated = new EventEmitter<any>();

  questionForm!: FormGroup;
  isSubmitting: boolean = false
  isLoading: boolean = false;
  locationError: string | null = null
  errorMessage: string | null = null
  userLocation: { latitude: number | null; longitude: number | null } = {
    latitude: null,
    longitude: null
  };
  private subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private questionService: QuestionService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.getUserLocation()
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initForm() {
    this.questionForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    })
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude, position.coords.longitude);
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          this.locationError = "Unable to get your location. Please enter your location manually."
        },
      )
    } else {
      this.locationError = "Geolocation is not supported by your browser."
    }
  }

  get formControl() {
    return this.questionForm.controls;
  }

  onSubmit() {
    this.isSubmitting = true;
    if (this.questionForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = ''

    if (!this.authService.isAuthenticated){
      this.handleAuthError();
      return;
    }

    const questionData: QuestionFormData = {
      title: this.formControl['title'].value,
      content: this.formControl['content'].value,
      location: this.userLocation,
    }

    const token = this.authService.getToken();
    if (!token) {
      this.handleAuthError();
      return;
    }
    const subscription = this.questionService.createQuestion(questionData, token).subscribe({
      next: (response: Question) => {
        this.isLoading = false;
        this.questionCreated.emit(response);
        this.close.emit();
        this.resetForm();
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = typeof error === 'string' ? error : 'An error occurred while creating the question.';
      }
    })
    this.subscriptions.add(subscription);
  }

  private handleAuthError(): void {
    this.isLoading = false;
    this.errorMessage = 'You must be logged in to create a question';
    setTimeout(() => {
      this.closeModal();
      this.router.navigate(['/login']);
    }, 1500);
  }

  private resetForm(): void {
    this.questionForm.reset();
    this.isSubmitting = false;
  }

  closeModal(): void {
    this.isSubmitting = false;
    this.isLoading = false;
    this.close.emit()
  }

  preventClose(event: Event): void {
    event.stopPropagation()
  }
}
