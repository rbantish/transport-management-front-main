import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../models/customer';
@Injectable({
  providedIn: 'root'
})
export class CookieCustomService {
  cookiename: string = "userinfo";
  constructor(private cookieService: CookieService) {}

  // Set a cookie
  // Expires in 7 days
  setCookie(info: UserInfo) {
    this.cookieService.set(this.cookiename, JSON.stringify(info), 7); 
  }

  // Get cookie
  getCookie() {
    console.log(this.cookieService.getAll(),"all cookies")
    const userInfo = this.cookieService.get(this.cookiename);
    if (userInfo) {
      return JSON.parse(userInfo) as UserInfo;
    }
    return undefined;
  }

  // Delete cookie
  deleteCookie() {
    this.cookieService.delete(this.cookiename);
  }
}
