import {
  CanActivate,
  Router,
} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {Observable, take, map} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
        map((user) => {
          if (user){
            return true;
          }else {
            this.authService.logout();
            this.router.navigate(['/']);
            return false;
          }
        })
    )
  }
};
