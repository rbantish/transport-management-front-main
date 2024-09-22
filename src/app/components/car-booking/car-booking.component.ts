import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VehicleResponse } from '../../models/vehicle';
import { FormControl, FormGroup } from '@angular/forms';
import { PrimengLib } from '../../modules/primenglibs.module';
import { CoreModule } from '../../modules/core.modules';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-car-booking',
  standalone: true,
  imports: [CoreModule, PrimengLib],
  templateUrl: './car-booking.component.html',
  styleUrl: './car-booking.component.css'
})
export class CarBookingComponent implements OnInit {
  imageUrl: string = environment.serverUrl;
  vehicles: Array<VehicleResponse> = [];
  copyVehicles: Array<VehicleResponse> = [];
  paginatedVehicles: Array<VehicleResponse> = [];
  vehicleModels: Array<string> = [];
  vehicleType: Array<string> = [];
  vehicleMake: Array<string> = [];
  vehicleModel: Array<string> = [];
  rangeValues: number[] = [20, 80];
  layout: any = 'grid';
  itemsPerPage = 6;
  first = 0;
  totalRecords = 0; // This tracks the total number of vehicles
  vehicleFormGroup: FormGroup = new FormGroup({
    type: new FormControl(['']),
    make: new FormControl(['']),
    model: new FormControl(['']),
  });

  constructor(private apiService: ApiService, private router: Router) {}

  bookVehicle(vehicleId: number) {
    this.router.navigate(['rent', vehicleId]);
  }

  setDefaultImage(event: any) {
    event.target.src = 'img/default.png'; // Path to default image
  }

  rentVehicle(vehicleId: number) {
    this.router.navigate(['trip', vehicleId]);
  }

  filter() {
    this.vehicles = this.copyVehicles;
    let copy = [...this.vehicles];
    let result: Array<VehicleResponse> = [];
    let controls = this.vehicleFormGroup.controls;

    if (controls['type'].value != '') {
      result = result.concat(copy.filter(x => x.vehicleTypeCode == controls['type'].value));
    }

    if (controls['model'].value != '') {
      result = result.concat(copy.filter(x => x.model == controls['model'].value));
    }

    if (controls['make'].value != '') {
      result = result.concat(copy.filter(x => x.make == controls['make'].value));
    }
    this.vehicles = Array.from(new Set(result));

    // Update totalRecords and paginate after filtering
    this.totalRecords = this.vehicles.length;
    this.paginate({ first: 0, rows: this.itemsPerPage });
  }

  reset() {
    this.vehicles = this.copyVehicles;
    this.vehicleFormGroup.reset();
    this.totalRecords = this.vehicles.length;
    this.paginate({ first: 0, rows: this.itemsPerPage });
  }

  paginate(event: any) {
    this.first = event.first;
    const start = event.first;
    const end = event.first + event.rows;
    this.paginatedVehicles = this.vehicles.slice(start, end);
  }

  async ngOnInit() {
    this.vehicles = (await this.apiService.retrieveAllCars()).filter(x => x.vehicleStatusCode !="Inactive").sort((a, b) => b.id - a.id);
    this.copyVehicles = [...this.vehicles]; // make a copy of vehicle array
    this.totalRecords = this.vehicles.length;
    this.vehicleType = Array.from(new Set(this.vehicles.map(x => x.vehicleTypeCode))); //Taking unique vehicle type
    this.vehicleMake = Array.from(new Set(this.vehicles.map(x => x.make)));//Taking unique vehicle make
    this.vehicleModel = Array.from(new Set(this.vehicles.map(x => x.model)));//Taking unique vehicle model
    this.paginate({ first: 0, rows: this.itemsPerPage });
  }

  
}
