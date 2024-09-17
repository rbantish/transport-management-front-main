import { Component } from '@angular/core';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { AdminRequest } from '../../models/admin';
import { UserInfo } from '../../models/customer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CoreModule,PrimengLib],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(private authService: AuthService, private customMessageService: CustomMessageService, private apiService: ApiService, private customCookieService: CookieCustomService, private router: Router){}

  async onSubmit() {
    try {
      if (this.loginForm.invalid) {
        this.customMessageService.showError("Email or password invalid");
        if(this.loginForm.controls['email'].value == ""){
          this.customMessageService.showError("Email empty");
        }
        
        if(this.loginForm.controls['password'].value == ""){
          this.customMessageService.showError("Email empty");
        }
        return;
      }
      let request: AdminRequest = {
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value
      }
      let response = await this.apiService.adminLogin(request);
      if(response.status == 200){
        let account = this.customCookieService.getCookie();
        if(account){
          this.customCookieService.deleteCookie;
        }

        let info: UserInfo = response.body as UserInfo;
        this.authService.setUserInfo(info);
        this.router.navigate([`/${info.type}`]);
      }
    } catch (error) {
      this.customMessageService.showError("Error on admin login")
    }
    
  }
}
