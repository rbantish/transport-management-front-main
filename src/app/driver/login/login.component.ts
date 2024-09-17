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
    phoneNumber: new FormControl('', [Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });
  
  constructor(private authService: AuthService, private customMessageService: CustomMessageService, private apiService: ApiService, private customCookieService: CookieCustomService, private router: Router){}

  validateLogin(){
    const controls = this.loginFormGroup.controls;
    if (controls['phoneNumber'].invalid) {
      if (controls['phoneNumber'].errors?.['required']) {
        this.customMessageService.showError('phone number is required');
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

      const request = {phoneNumber: this.loginFormGroup.controls['phoneNumber'].value, password: this.loginFormGroup.controls['password'].value}
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
