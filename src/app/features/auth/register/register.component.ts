import {Component, OnDestroy, OnInit} from "@angular/core"
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms"
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {catchError, finalize, Subject, takeUntil} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../core/auth/services/auth.service';

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.initForm()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get formControl() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const registrationData = {
      email: this.formControl['email'].value,
      password: this.formControl['password'].value,
      password_confirmation: this.formControl['confirmPassword'].value
    };

    this.authService.register(registrationData)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.log(error)
          this.errorMessage = error || 'Registration failed. Please try again.';
          throw error
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.router.navigate(['/'], {
            queryParams: { registered: 'success' }
          });
        },
        error: () => {
          console.log('Error occurred');
        }
      })
  }
}

