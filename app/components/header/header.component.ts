import { AfterViewInit, Component, OnInit } from '@angular/core';
import { authGuard } from '../../services/auth.guard';
import { CookieCustomService } from '../../services/cookie.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit,AfterViewInit {
  loggedIn: boolean = false;
  userType: string = "";

  constructor(private customCookie: CookieCustomService, private authService: AuthService){}
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    // Subscribe to login status
    this.authService.loggedIn$.subscribe(status => {
      this.loggedIn = status;
      this.userType = this.authService.getUserRole()!;
    });
  }



}
