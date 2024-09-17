import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieCustomService } from './cookie.service';
import { UserInfo } from '../models/customer';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();  // Observable to subscribe to
   
  constructor(private router: Router, private customCookie: CookieCustomService) {}

  // Store user info in cookies (expires after 7 days)
  setUserInfo(user: UserInfo) {
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days in milliseconds
    const expires = `expires=${date.toUTCString()}`;

    // Save user details and role (type) in cookies
    document.cookie = `userId=${user.id}; ${expires}; path=/`;
    document.cookie = `userRole=${user.type}; ${expires}; path=/`; // Role is stored in 'type'
    document.cookie = `userName=${user.name}; ${expires}; path=/`;
    if(user.address){
      document.cookie = `userAdddress=${user.address}; ${expires}; path=/`;
    }
    
    if(user.phoneNumber){
      document.cookie = `userPhone=${user.phoneNumber}; ${expires}; path=/`;
    }
    console.log(user.email, user)
    if(user.email){
      document.cookie = `userEmail=${user.email}; ${expires}; path=/`;
    } 

    // Emit login status
    this.loggedInSubject.next(true);
  }

  // Retrieve the user's role (type)
  getUserRole(): string | null {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userRole='));
    return cookieValue ? cookieValue.split('=')[1] : null;
  }

  // Retrieve other user info if needed
  getUserInfo(): UserInfo | null {
    const id = this.getCookie('userId');
    const name = this.getCookie('userName');
    const role = this.getCookie('userRole');
    const address = this.getCookie('userAddress');
    const phone = this.getCookie('userPhone');
    const email = this.getCookie('userEmail');

    let userInfo: UserInfo = {
      id: id ? Number.parseInt(id) : 0,
      name: name ? name : "",
      email: email != null ? email : "",
      phoneNumber: phone ? Number.parseInt(phone) : 0,
      address: address ? address : "",
      type: role ? role : ""
    };
    if(id == null){
      return null;
    }
    return userInfo;
  }

  // Helper function to retrieve a cookie by name
  private getCookie(name: string): string | null {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`));
    return cookieValue ? cookieValue.split('=')[1] : null;
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getUserRole();
  }

  // Clear cookies on logout
  logout() {
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userAddress=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userPhone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.router.navigate(['/login']);
    // Emit logout status
    this.loggedInSubject.next(false);
  }


}
