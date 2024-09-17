import { Component, OnInit } from '@angular/core';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { Router } from '@angular/router';
import { StatusResponse, StatusRequest } from '../../models/status';
import { ApiService } from '../../services/api.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { TripRental } from '../../models/rental';
import { TriAddDriverRequest } from '../../models/trip';
import { DriverResponse } from '../../models/driver';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-rentaltrip-table',
  standalone: true,
  imports: [CoreModule, PrimengLib],
  templateUrl: './rental-table.component.html',
  styleUrl: './rental-table.component.css'
})
export class RentaltripTableComponent implements OnInit  {

  rentals: Array<TripRental>  = [];
  drivers: Array<DriverResponse> = [];
  statuses: Array<StatusResponse> = [];
  driversOptions: any[] = [];
  statusesOptions: Array<any> = [];
  selectedStatus: number  = 0;
  selectedDriver: number = 0;
  selectedTrip: TripRental | undefined;
  displayDriverDialog: boolean = false;
  selectedPaymentStatus: number = 0;
  adminId: number = 1;
  constructor(private customMessageService: CustomMessageService, private apiService: ApiService, private authService: AuthService, private router: Router){}

  async ngOnInit() {
    await this.getAllRentalAndUserInfo();
  }

  async getAllRentalAndUserInfo(){
    let userInfo = this.authService.getUserInfo();
    if(userInfo){
      this.adminId = userInfo.id;
    }
    await this.getAllRentals();
    this.drivers = await this.apiService.retrieveAllDrivers();
    this.drivers.map(x => {
      this.driversOptions.push({name: x.driverName, id: x.driverId})
    })
  }

  async getAllRentals(){
    this.statuses = await this.apiService.retrieveAllStatuses();
    this.statuses.map(x => {
      this.statusesOptions.push({name: x.code, id: x.id});
    });
    let x = await this.apiService.retrieveAllRentalAndTrip();
    if(x){
      this.rentals = x.sort().sort((a,b) => b.entityId - a.entityId);
    }
  }

  showDriverDialog(entity: any) {
    this.selectedTrip = entity;
    this.displayDriverDialog = true;
  }

  async assignDriver(driverId: number) {
    try {
      if(this.selectedTrip){
        let request: TriAddDriverRequest ={
          tripId: this.selectedTrip?.entityId!,
          driverId: driverId
        }
        let response = await this.apiService.addDriverToTrip(request);
        await this.getAllRentalAndUserInfo();
        if(response.status == 200){
          this.customMessageService.showSuccess("Success");
        }else{
          this.customMessageService.showError(response.body as string);
        }
  
      }
     
      this.displayDriverDialog = false;
    } catch (error) {
      this.customMessageService.showError("Error");
    }
    
  }

  async pay(id: number) {
    try {
      let response = await this.apiService.updatePayment({paymentId: id, updatedBy: this.adminId});
      if(response.status == 200){
        this.customMessageService.showSuccess("Success");
        await this.getAllRentalAndUserInfo();
      }else{
        this.customMessageService.showError(response.body as string)
      }
    } catch (error) {
      this.customMessageService.showError("Error");
    }
    
  }

  async updateStatus(id:number, type: string, paymentId:number, table: "payment" | "status") {
    let typeRequest: string = "";
    let value: number = 0;
    let idValue: number = id;
    if(table.toLowerCase() == "payment"){
      typeRequest  = "PaymentStatus";
      value = this.selectedPaymentStatus;
      idValue = paymentId;
    }else if(table.toLowerCase() == "status"){
      if(type.toLowerCase() == "rental"){
        typeRequest = 'RentalStatus';
      }else  if(type.toLowerCase() == "trip"){
        typeRequest = 'TripStatus';
      }
      value = this.selectedStatus
    }

    let request: StatusRequest = {
      type: typeRequest,
      id: idValue,
      statusId: value,
      updatedBy: this.adminId
    }
    let response = await this.apiService.updateStatus(request);
    if(response.status == 200){
      this.customMessageService.showSuccess("Success");
      await this.getAllRentals();
    }else{
      this.customMessageService.showError("Error");
    }
  }
}
