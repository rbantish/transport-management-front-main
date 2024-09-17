import { Component } from '@angular/core';
import { CarBookingComponent } from "../car-booking/car-booking.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CarBookingComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
