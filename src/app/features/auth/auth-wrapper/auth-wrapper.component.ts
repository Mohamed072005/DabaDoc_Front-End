import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth/auth.service';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-auth-wrapper',
  imports: [
    RouterOutlet
  ],
  templateUrl: './auth-wrapper.component.html',
  styleUrl: './auth-wrapper.component.css'
})
export class AuthWrapperComponent implements OnInit {
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.logout();
  }
}
