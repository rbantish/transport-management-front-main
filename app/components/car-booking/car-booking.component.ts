import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VehicleResponse } from '../../models/vehicle';
import { FormControl, FormGroup } from '@angular/forms';
import { PrimengLib } from '../../modules/primenglibs.module';
import { CoreModule } from '../../modules/core.modules';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-car-booking',
  standalone: true,
  imports: [CoreModule,PrimengLib],
  templateUrl: './car-booking.component.html',
  styleUrl: './car-booking.component.css'
})
export class CarBookingComponent implements OnInit {
  imageUrl: string = environment.serverUrl;
  vehicles: Array<VehicleResponse> = [];
  copyVehicles: Array<VehicleResponse> = [];
  vehicleModels: Array<string> = [];
  vehicleType: Array<string> = [];
  vehicleMake: Array<string> = [];
  vehicleModel: Array<string> = [];
  rangeValues: number[] = [20, 80];
  layout: any = 'grid';
  paginatedVehicles = [];  // Holds the paginated results
  itemsPerPage = 5;        // Set how many items per page
  first = 0;               // To track the first item on the current page
  vehicleFormGroup: FormGroup = new FormGroup({
      type: new FormControl(['']),
      make: new FormControl(['']), // Required field
      model: new FormControl(['']), // Required field
  });

  constructor(private apiService: ApiService, private router: Router){}

  bookVehicle(vehicleId: number){
    this.router.navigate(["rent",vehicleId]);
  }

  rentVehicle(vehicleId: number){
    this.router.navigate(["trip",vehicleId]);
  }

  filter() {
    this.vehicles = this.copyVehicles;
    let copy = [...this.vehicles];
    let result: Array<VehicleResponse> = [];
    let controls = this.vehicleFormGroup.controls;

    if(controls['type'].value != ''){
      result = result.concat(copy.filter(x => x.vehicleTypeCode == controls['type'].value));
    }

    if(controls['model'].value != ''){
      result = result.concat(copy.filter(x => x.model == controls['model'].value));
    }

    if(controls['make'].value != ''){
      result = result.concat(copy.filter(x => x.make == controls['make'].value));
    }
    this.vehicles = Array.from(new Set(result));
     
  }
  
  reset(){
    this.vehicles = this.copyVehicles;
    this.vehicleFormGroup.reset();
  }

  paginate(event: any) {
    this.first = event.first;
    const start = event.first;
    const end = event.first + event.rows;
    this.vehicles = this.vehicles.slice(start, end); 
  }

  async ngOnInit() {
    this.vehicles = await this.apiService.retrieveAllCars();
    this.copyVehicles = [...this.vehicles]; // make a copy of vehicle array
    this.vehicleType = Array.from(new Set(this.vehicles.map(x => x.vehicleTypeCode)));
    this.vehicleMake = Array.from(new Set(this.vehicles.map(x => x.make)));
    this.vehicleModel = Array.from(new Set(this.vehicles.map(x => x.model)));
    this.paginate({ first: 0, rows: this.itemsPerPage });
  }


}
