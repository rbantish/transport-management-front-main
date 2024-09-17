import { Component } from '@angular/core';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { Router } from '@angular/router';
import { StatusResponse, StatusRequest } from '../../models/status';
import { ApiService } from '../../services/api.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { CustomerStatusResponse } from '../../models/customer';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [CoreModule, PrimengLib],
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.css'
})
export class CustomerTableComponent {
  customers: Array<CustomerStatusResponse>  = [];
  statuses: Array<StatusResponse> = [];
  statusesOptions: Array<any> = [];
  selectedStatus: number  = 0;
  adminId: number = 1;
  constructor(private customMessageService: CustomMessageService, private apiService: ApiService, private customCookieService: CookieCustomService, private router: Router){}

  async ngOnInit() {
    await this.getAllCustomers();
  }

  async getAllCustomers(){
    this.statuses = await this.apiService.retrieveAllStatuses();
    this.statuses.map(x => {
      this.statusesOptions.push({name: x.code, id: x.id});
    });

    this.customers =  (await this.apiService.retrieveAllCustomers()).sort((a,b) => b.customerId - a.customerId);
  }

  async updateStatus(id:number) {
    let request: StatusRequest = {
      type: 'AccountStatus',
      id,
      statusId: this.selectedStatus,
      updatedBy: this.adminId
    }
    let response = await this.apiService.updateStatus(request);
    if(response.status == 200){
      this.customMessageService.showSuccess("Success");
      await this.getAllCustomers();
    }else{
      this.customMessageService.showError("Error");
    }
  }
}
