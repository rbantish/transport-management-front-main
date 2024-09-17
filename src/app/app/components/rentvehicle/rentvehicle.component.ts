import { Component, OnInit } from '@angular/core';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleResponse } from '../../models/vehicle';
import { CustomMessageService } from '../../services/custom-message.service';
import { RentalRequest } from '../../models/rental';
import { CookieCustomService } from '../../services/cookie.service';
import { Customer, UserInfo } from '../../models/customer';
import {PaymentResponse} from '../../models/paymentMethod'
@Component({
  selector: 'app-rentvehicle',
  standalone: true,
  imports: [CoreModule,PrimengLib],
  templateUrl: './rentvehicle.component.html',
  styleUrl: './rentvehicle.component.css'
})
export class RentvehicleComponent implements OnInit {
  selectedDates: Date[] = [];
  bookedDates: Date[] = [];
  selectedPaymentId: number = 0;
  paymentMethods: PaymentResponse[] = [];
  paymentMethodOptions: Array<{name:string, value: number}> = [];
  customer: UserInfo | undefined;
  display: boolean = false;
  drivingLicense: string = '';
  today: Date = new Date();
  vehicle: VehicleResponse | undefined;
  constructor(private apiService: ApiService, private route: Router, private activatedRoute: ActivatedRoute, private messageService: CustomMessageService, private customCookieService: CookieCustomService){}

  async ngOnInit() {
    await this.retrieveInfos();
  }

  async retrieveInfos(){
    try{
      let vehicleId = this.activatedRoute.snapshot.paramMap.get('id');
      this.bookedDates = (await this.apiService.getCalendarForThisVehicle(vehicleId!)).map(x => new Date(x.date));
      this.vehicle = await this.apiService.getVehicleById(vehicleId!);
      this.customer = this.customCookieService.getCookie();
      this.paymentMethods = await this.apiService.getPaymentMethods();
      this.paymentMethods.map(x => {
        this.paymentMethodOptions.push({name: x.type, value:x.id});
      });
    }catch(error){
      this.messageService.showError("Error while fetching information on rent page")
    }
  }

  showDialog() {
    this.display = true;
  }

  async submit() {
    if (this.drivingLicense) {
      try {
        let customer = {
          id: this.customer?.id,
          driverLicenseNumber: this.drivingLicense
        };
        let response = await this.apiService.modifyCustomer(customer as Customer)
        if(response.status == 200){
          this.messageService.showSuccess("Profile Updated");
          if(this.customer){
            this.customer.driverLicenseNumber = this.drivingLicense;
            this.customCookieService.setCookie(this.customer!);
          }      
        }
        this.display = false; 
      } catch (error) {
        this.messageService.showError("Error occured");
      }  
    } else {
     this.messageService.showError("Enter your driving license");
    }
  }

  getNumberOfDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Add 1 to include the start date
  }
  
  async bookVehicle(){
    try {

      if(this.customer?.driverLicenseNumber == null){
        this.showDialog();
      }
      
      if(this.drivingLicense  == ""){
        return;
      }
      
      let vehicleId: number =  Number.parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
      if(this.selectedPaymentId == 0){
        this.messageService.showError("Select a Payment Type");
        return;
      }

      
      let request: RentalRequest = {
        customerId: this.customer?.id!,
        vehicleId: vehicleId,
        startDate: this.selectedDates[0],
        endDate: this.selectedDates[1],
        paymentTypeId: this.selectedPaymentId,
        totalPayment: this.getTotalPrice(this.getNumberOfDays(this.selectedDates[0], this.selectedDates[1]) - 1)
      }

      let response = await this.apiService.addRental(request);
      if(response.status == 200){
        this.messageService.showSuccess(response.body!);
        await this.retrieveInfos();
        setTimeout(() => {
          this.route.navigate(["cart"]);
        }, 3000);
        return;
      }
      this.messageService.showError(response.body as string);
      return;
      } catch (error) {
        this.messageService.showError("Error occured while booking vehicle");
      }
    
  }

   // Event handler when a date is selected
   onDateSelect(event: any) {
    if (this.selectedDates && this.selectedDates.length === 2) {
      const startDate = this.selectedDates[0];
      const endDate = this.selectedDates[1];

      // Check if the selected range includes any booked dates
      if (this.isRangeIncludesBookedDates(startDate, endDate)) {
        // If it includes booked dates, reset selection and notify user
        this.selectedDates = [];
        alert('Your selected range includes unavailable dates. Please choose a valid range.');
      }
    }
  }

  // Function to check if any of the booked dates fall within the selected range
  isRangeIncludesBookedDates(startDate: Date, endDate: Date): boolean {
    return this.bookedDates.some(booked => booked >= startDate && booked <= endDate);
  }

  getTotalPrice(days: number): number {
    return days * this.vehicle?.dailyPrice!;
  }
}
