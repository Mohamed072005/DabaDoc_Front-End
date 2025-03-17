import { Routes } from '@angular/router';
import {LoginComponent} from './features/auth/login/login.component';
import {RegisterComponent} from './features/auth/register/register.component';
import {HomeComponent} from './features/home/home/home.component';
import {AuthGuard} from './core/guards/auth.guard';
import {AuthWrapperComponent} from './features/auth/auth-wrapper/auth-wrapper.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthWrapperComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
];
