import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginComponent,
    RegisterComponent
  ],
})
export class AuthModule { }
