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
import { AuthService } from '../services/auth.service';

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
  constructor(private customMessageService: CustomMessageService, private apiService: ApiService, private authService: AuthService, private router: Router){}
  async ngOnInit() {
    let userInfo = this.authService.getUserInfo();
    if(userInfo){
      this.trips = await this.apiService.retrieveAllTripsForADriver(userInfo.id);
      this.initMap();
    }
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
    // Define custom icon
    const customIcon = L.icon({
      iconUrl: 'leaflet/marker-icon.png', // Path to your custom icon
      iconSize: [25, 41], // Size of the icon
      iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
      popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
      shadowUrl: 'leaflet/marker-shadow.png', // Path to the shadow image (if any)
      shadowSize: [41, 41] // Size of the shadow
    });
    this.locations.sort((a,b) => a.order - b.order).forEach(location => {
      // Split the lat/lng string into separate numbers
      let latLng:any =  location.locationPoint.match(/-?\d+(\.\d+)?/g);
      let locationName: string = "Point "+location.order;

      if(location.order == 0){
        locationName = "Starting Point";
      }

      if(location.order == this.locations.length - 1){
        locationName = "End Point";
      }
      
      // Add marker to map
      if (this.map) {
        L.marker(latLng, {icon:customIcon})
          .addTo(this.map)
          .bindTooltip(locationName)
          .bindPopup(`<b>Coordinates:</b> ${latLng[0]}, ${latLng[1]}`);
      }
    });
  }

}
