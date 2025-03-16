import {Component, OnInit} from "@angular/core"
import { Router } from "@angular/router"
import {User} from '../../../core/models/user.model';
import {AuthService} from '../../../core/services/auth/auth.service';

@Component({
  selector: "app-navbar",
  standalone: true,
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit{
  currentUser: User | null = null

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/"])
  }

  navigateTo(route: string): void {
    this.router.navigate([route])
  }
}

