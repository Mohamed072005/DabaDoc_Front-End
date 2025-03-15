import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {catchError, finalize, Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  loginForm!: FormGroup
  submitted = false
  loading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.initForm()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  get formControl(){
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = ''

    const loginForm = {
      email: this.formControl['email'].value,
      password: this.formControl['password'].value
    }

    this.authService.login(loginForm)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.errorMessage = error || 'Login failed. Please try again.'
          throw error
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          this.errorMessage = error || 'Login failed. Please try again.'
        }
      })

    this.submitted = false
    this.loginForm.reset()
  }
}
