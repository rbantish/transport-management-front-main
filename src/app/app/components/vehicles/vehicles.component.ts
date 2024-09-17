import { Component } from '@angular/core';
import { CarBookingComponent } from "../car-booking/car-booking.component";

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CarBookingComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent {

}
