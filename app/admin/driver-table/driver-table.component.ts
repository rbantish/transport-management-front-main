import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerStatusResponse } from '../../models/customer';
import { StatusResponse, StatusRequest } from '../../models/status';
import { ApiService } from '../../services/api.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { DriverResponse } from '../../models/driver';

@Component({
  selector: 'app-driver-table',
  standalone: true,
  imports: [CoreModule,PrimengLib],
  templateUrl: './driver-table.component.html',
  styleUrl: './driver-table.component.css'
})
export class DriverTableComponent {
  drivers: Array<DriverResponse>  = [];
  statuses: Array<StatusResponse> = [];
  statusesOptions: Array<any> = [];
  selectedStatus: number  = 0;
  adminId: number = 1;
  constructor(private customMessageService: CustomMessageService, private apiService: ApiService, private customCookieService: CookieCustomService, private router: Router){}

  async ngOnInit() {
    await this.getAllDrivers();
  }

  async getAllDrivers(){
    this.statuses = await this.apiService.retrieveAllStatuses();
    this.statuses.map(x => {
      this.statusesOptions.push({name: x.code, id: x.id});
    });

    this.drivers =  (await this.apiService.retrieveAllDrivers()).sort((a,b) => b.driverId - a.driverId);
  }

  async updateStatus(id:number) {
    let request: StatusRequest = {
      type: 'DriverStatus',
      id,
      statusId: this.selectedStatus,
      updatedBy: this.adminId
    }
    let response = await this.apiService.updateStatus(request);
    if(response.status == 200){
      this.customMessageService.showSuccess("Success");
      await this.getAllDrivers();
    }else{
      this.customMessageService.showError("Error");
    }
  }
}
