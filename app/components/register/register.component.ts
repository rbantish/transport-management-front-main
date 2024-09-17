import { Component } from '@angular/core';
import { PrimengLib } from '../../modules/primenglibs.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { Customer } from '../../models/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [PrimengLib,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  customerOptions: Array<any> = [{name:"Individual", value: 1}, {name: "Corporate", value: 2}];
  registrationForm: FormGroup = new FormGroup({
    accountType: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmPassword: new FormControl('', [Validators.minLength(4), Validators.required]),
  });

  constructor(private messageService: MessageService, private apiService: ApiService, private router: Router){}

  validateForm(): boolean {
    const controls = this.registrationForm.controls;
    if (controls['accountType'].invalid) {
      this.showError('Please select an account type');
      return false;
    }

    if (controls['email'].invalid) {
      if (controls['email'].errors?.['required']) {
        this.showError('email is required');
      } else if (controls['email'].errors?.['email']) {
        this.showError('Please enter a valid email');
      }
      return false;
    }

    if (controls['phoneNumber'].invalid) {
      if (controls['phoneNumber'].errors?.['required']) {
        this.showError('Phone number is required');
      } else if (controls['phoneNumber'].errors?.['minlength']) {
        this.showError('Phone number must be at least 10 digits');
      } else if (controls['phoneNumber'].errors?.['maxlength']) {
        this.showError('Phone number must be at most 15 digits');
      }
      return false;
    }

    if (controls['address'].invalid) {
      this.showError('Address is required');
      return false;
    }

    if (controls['password'].invalid) {
      if (controls['password'].errors?.['required']) {
        this.showError('Password is required');
      } else if (controls['password'].errors?.['minlength']) {
        this.showError('Password must be at least 4 characters');
      }
      return false;
    }

    if (controls['confirmPassword'].invalid) {
      this.showError('Confirm password is required');
      return false;
    }

    // Check if passwords match
    const password = controls['password'].value;
    const confirmPassword = controls['confirmPassword'].value;
    if (password !== confirmPassword) {
      this.showError('Passwords do not match');
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

      let customerRequest: Customer = {
        name: this.registrationForm.controls['name'].value,
        email: this.registrationForm.controls['email'].value,
        phoneNumber: Number.parseInt(this.registrationForm.controls['phoneNumber'].value),
        address: this.registrationForm.controls['address'].value,
        customerTypeId: Number.parseInt(this.registrationForm.controls['accountType'].value),
        password: this.registrationForm.controls['password'].value
      }
 
      let response = await this.apiService.addCustomer(customerRequest);
      if(response.status == 201){
        this.showSuccess("Account Created!");
        this.router.navigate(["login"])
      }else{
        this.showError(response.body as string);
      }
      return;
    }catch(error){
      this.showError("Error occured, Try Again later!");
      return;
    }
  }


  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }
  
}
