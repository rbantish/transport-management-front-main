import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Customer } from '../../models/customer';
import { ApiService } from '../../services/api.service';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { CustomMessageService } from '../../services/custom-message.service';
import { DriverRequest } from '../../models/driver';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CoreModule,PrimengLib],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class DriverRegisterComponent {
  registrationForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    license: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmPassword: new FormControl('', [Validators.minLength(4), Validators.required]),
  });

  constructor(private messageService: CustomMessageService, private apiService: ApiService, private router: Router){}

  validateForm(): boolean {
    const controls = this.registrationForm.controls;
    if (controls['phoneNumber'].invalid) {
      if (controls['phoneNumber'].errors?.['required']) {
        this.messageService.showError('Phone number is required');
      } else if (controls['phoneNumber'].errors?.['minlength']) {
        this.messageService.showError('Phone number must be at least 10 digits');
      } else if (controls['phoneNumber'].errors?.['maxlength']) {
        this.messageService.showError('Phone number must be at most 15 digits');
      }
      return false;
    }

    if (controls['license'].invalid) {
      this.messageService.showError('License is required');
      return false;
    }

    if (controls['password'].invalid) {
      if (controls['password'].errors?.['required']) {
        this.messageService.showError('Password is required');
      } else if (controls['password'].errors?.['minlength']) {
        this.messageService.showError('Password must be at least 4 characters');
      }
      return false;
    }

    if (controls['confirmPassword'].invalid) {
      this.messageService.showError('Confirm password is required');
      return false;
    }

    // Check if passwords match
    const password = controls['password'].value;
    const confirmPassword = controls['confirmPassword'].value;
    if (password !== confirmPassword) {
      this.messageService.showError('Passwords do not match');
      return false;
    }

    // All validations passed
    return true;
  }

  async onSubmit(){
    try{
      let validation = this.validateForm();
      if(!validation){
        return;
      }

      let request: DriverRequest = {
        name: this.registrationForm.controls['name'].value,
        phoneNumber: Number.parseInt(this.registrationForm.controls['phoneNumber'].value),
        licenseNumber: this.registrationForm.controls['license'].value,
        password: this.registrationForm.controls['password'].value
      }
 
      let response = await this.apiService.addDriver(request);
      console.log(response)
      if(response.status == 200){
        this.messageService.showSuccess(response.body?.toString()!);
        this.router.navigate(["driver","login"])
      }else{
        this.messageService.showError("Error");
      }
      return;
    }catch(error){
      this.messageService.showError("Error occured, Try Again later!");
      return;
    }
  }
  showSuccess(arg0: string) {
    throw new Error('Method not implemented.');
  }

}
