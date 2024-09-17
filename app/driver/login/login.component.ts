import { Component } from '@angular/core';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer, UserInfo } from '../../models/customer';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CoreModule, PrimengLib],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class DriverLoginComponent {
  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });
  
  constructor(private authService: AuthService, private customMessageService: CustomMessageService, private apiService: ApiService, private customCookieService: CookieCustomService, private router: Router){}

  validateLogin(){
    const controls = this.loginFormGroup.controls;
    if (controls['email'].invalid) {
      if (controls['email'].errors?.['required']) {
        this.customMessageService.showError('email is required');
        return false;
      } else if (controls['email'].errors?.['email']) {
        this.customMessageService.showError('Please enter a valid email');
        return false;
      }
    }

    if (controls['password'].invalid) {
      if (controls['password'].errors?.['required']) {
        this.customMessageService.showError('password is required');
        return false;
      }
    }
    return true;
  }

  async onSubmit(){
    try {
      if(!this.validateLogin()){
        return;
      }

      const request = {email: this.loginFormGroup.controls['email'].value, password: this.loginFormGroup.controls['password'].value}
      let response = await this.apiService.login(request as Customer);
      if(response.status == 200){
        let info: UserInfo = response.body as UserInfo;
        this.authService.setUserInfo(info);
        this.router.navigate([`/${info.type}`]);
      }else{
        this.customMessageService.showError(response.body as string)
      }
      return;
    } catch (error) {
      this.customMessageService.showError('Error occured during logging');
      return;
    }
  }
}
