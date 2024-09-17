import { Component, OnInit } from '@angular/core';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { VehicleResponse } from '../../models/vehicle';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { environment } from '../../../environments/environment.development';
import { StatusRequest, StatusResponse } from '../../models/status';

@Component({
  selector: 'app-vehicle-table',
  standalone: true,
  imports: [CoreModule,PrimengLib],
  templateUrl: './vehicle-table.component.html',
  styleUrl: './vehicle-table.component.css'
})
export class VehicleTableComponent implements OnInit{

  imageUrl: string = environment.serverUrl;
  vehicles: Array<VehicleResponse>  = [];
  statuses: Array<StatusResponse> = [];
  statusesOptions: Array<any> = [];
  selectedStatus: number  = 0;
  adminId: number = 1;
  constructor(private customMessageService: CustomMessageService, private apiService: ApiService, private customCookieService: CookieCustomService, private router: Router){}

  async ngOnInit() {
    await this.getAllVehicles();
  }

  async getAllVehicles(){
    this.statuses = await this.apiService.retrieveAllStatuses();
    this.statuses.map(x => {
      this.statusesOptions.push({name: x.code, id: x.id});
    });

    this.vehicles =  (await this.apiService.retrieveAllVehicles()).sort((a,b) => b.id - a.id);
  }

  navigateToAddVehicle() {
    this.router.navigate(["admin","add-vehicle"])
  }

  async updateStatus(id:number) {
    let request: StatusRequest = {
      type: 'VehicleStatus',
      id,
      statusId: this.selectedStatus,
      updatedBy: this.adminId
    }
    let response = await this.apiService.updateStatus(request);
    if(response.status == 200){
      this.customMessageService.showSuccess("Success");
      await this.getAllVehicles();
    }else{
      this.customMessageService.showError("Error");
    }
  }

}
