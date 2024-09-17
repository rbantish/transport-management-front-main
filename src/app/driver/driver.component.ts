import { Component } from '@angular/core';
import { Router } from '@angular/router';
import L, { LatLng } from 'leaflet';
import { TripWithVehicle } from '../models/trip';
import { TripLocationResponse } from '../models/tripLocation';
import { ApiService } from '../services/api.service';
import { CookieCustomService } from '../services/cookie.service';
import { CustomMessageService } from '../services/custom-message.service';
import { CoreModule } from '../modules/core.modules';
import { PrimengLib } from '../modules/primenglibs.module';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CoreModule, PrimengLib],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.css'
})
export class DriverComponent {
  private map: L.Map | undefined;
  latlngArray: string[] = [];
  driverId: number = 3;
  trips: Array<TripWithVehicle> = [];
  selectedTrip: TripWithVehicle | undefined;
  locations: Array<TripLocationResponse> = [];
  constructor(private customMessageService: CustomMessageService, private apiService: ApiService, private customCookieService: CookieCustomService, private router: Router){}
  async ngOnInit() {
    this.trips = await this.apiService.retrieveAllTripsForADriver(this.driverId);
    this.initMap();
   
  }

  async retrieveLocations(event: any) {
    this.locations = await this.apiService.retrieveLocationsByTripId(event.data.tripId);
    this.addMarkers();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-20.294079, 57.490768], 10);

    // Add the tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private addMarkers(): void {
    this.locations.sort((a,b) => a.order - b.order).forEach(location => {
      console.log(location)
      // Split the lat/lng string into separate numbers
      let latLng:any =  location.locationPoint.match(/-?\d+(\.\d+)?/g);
      console.log(latLng)

      // Add marker to map
      if (this.map) {
        L.marker(latLng)
          .addTo(this.map)
          .bindTooltip(`Order location: ${location.order + 1}`)
          .bindPopup(`<b>Coordinates:</b> ${latLng[0]}, ${latLng[1]}`);
      }
    });
  }

}
