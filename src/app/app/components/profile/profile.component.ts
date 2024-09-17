import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { UserInfo } from '../../models/customer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userInfo: UserInfo | undefined;
  constructor(private apiService: ApiService, private authService: AuthService, private messageService: CustomMessageService, private customCookieService: CookieCustomService){}
  
  ngOnInit(): void {
    let cookie = this.authService.getUserInfo();
    console.log(cookie)
    if(cookie){
      this.userInfo = cookie;
    }
  }

  logOut() {
    this.authService.logout();
  }


}
