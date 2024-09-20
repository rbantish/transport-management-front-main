import { AfterViewInit, Component, OnInit } from '@angular/core';
import L from 'leaflet';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { TripRequest } from '../../models/trip';
import { PaymentResponse } from '../../models/paymentMethod';
import { VehicleResponse } from '../../models/vehicle';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tripbooking',
  standalone: true,
  imports: [CoreModule,PrimengLib],
  templateUrl: './tripbooking.component.html',
  styleUrl: './tripbooking.component.css'
})
export class TripbookingComponent implements AfterViewInit, OnInit {
map: any ;
vehicle: VehicleResponse | undefined;
selectedDates: Array<Date> = [];
paymentMethods: Array<PaymentResponse> = [];
bookedDates: Array<Date> = [];
paymentMethodOptions: Array<any> = [];
pickupPoints: L.LatLng[] = [];
today: Date = new Date();
startLocation: any;
selectedPaymentId: number = 0;
endLocation: any;
distance: number = 0;
price: any;
totalCost: number = 0;
vehicleId: number = 0;
customerId: number = 0;
constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private route: Router, private messageService: CustomMessageService, private authService: AuthService){}
  
async ngOnInit() {

  let vehicleId = this.activatedRoute.snapshot.paramMap.get('id');
  if(!vehicleId){
     this.route.navigate(["vehicles"]);
     return;
  }
  this.vehicle = await this.apiService.getVehicleById(vehicleId);
  this.vehicleId  = Number.parseInt(vehicleId);
  let info = this.authService.getUserInfo();
  this.customerId = info?.id!;
  this.bookedDates = (await this.apiService.getCalendarForThisVehicle(vehicleId!)).map(x => new Date(x.date));
  this.paymentMethods = await this.apiService.getPaymentMethods();
      this.paymentMethods.map(x => {
        this.paymentMethodOptions.push({name: x.type, value:x.id});
      });
}

 // Event handler when a date is selected
 onDateSelect(event: any) {
  if (this.selectedDates && this.selectedDates.length === 2) {
    const startDate = this.selectedDates[0];
    const endDate = this.selectedDates[1];

    // Check if the selected range includes any booked dates
    if (this.isRangeIncludesBookedDates(startDate, endDate)) {
      // If it includes booked dates, reset selection and notify user
      this.selectedDates = [];
      this.messageService.showError('Your selected range includes unavailable dates. Please choose a valid range.');
    }
  }
}

// Function to check if any of the booked dates fall within the selected range
isRangeIncludesBookedDates(startDate: Date, endDate: Date): boolean {
  return this.bookedDates.some(booked => booked >= startDate && booked <= endDate);
}


calculateCost(){
  if(this.vehicle){
    return this.totalCost =  this.distance * this.vehicle?.tripPrice;
  }
  return 0;
}

ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: L.latLng(-20.1609, 57.5012),
      zoom: 14,
    });
    
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      tileSize:512,
      minZoom:1,
      zoomOffset:-1,
      crossOrigin:true,
    }).addTo(this.map);

    // Add click event to the map
    this.map.on('click', (e: any) => {
      const latlng = e.latlng;
      this.addPickupPoint(latlng);
    });
}

addPickupPoint(latlng: L.LatLng) {
  L.marker([latlng.lat, latlng.lng]).addTo(this.map)
      .bindPopup(`Pickup Point ${this.pickupPoints.length + 1}`)
      .openPopup();

  this.pickupPoints.push(latlng);
  this.startLocation = this.pickupPoints[0];
  this.endLocation = latlng;  
}

reset() {
  // Clear all markers and layers
  this.map.eachLayer((layer: any) => {
    if (!(layer instanceof L.TileLayer)) {
      this.map.removeLayer(layer);
    }
  });

  const defaultCenter = [-20.1609, 57.5012];  
  const defaultZoom = 13;               
  this.map.setView(defaultCenter, defaultZoom);
}

async submitBooking(){
  try {
    if(this.vehicleId){
      if(this.totalCost <= 0){
        this.messageService.showError("No cost calculated!");
        return;
      }
  
      if(this.selectedPaymentId <= 0){
        this.messageService.showError("No payment Method selected!");
        return;
      }
  
      let request: TripRequest = {
        vehicleId: this.vehicleId,
        paymentMethodId: this.selectedPaymentId,
        customerId: this.customerId,
        tripDate: this.selectedDates,
        tripCost: this.totalCost,
        points: this.pickupPoints.map(x => x.toString())
      }
  
      let response = await this.apiService.addTrip(request);
      if(response.status == 200){
        this.messageService.showSuccess(response.body as string);
        setTimeout(() => {
          this.route.navigate(["cart"]);
        }, 3000);
       
      }else{
        this.messageService.showError(response.body as string);
      }
    }
  } catch (error) {
    this.messageService.showError("Error occured")
  }
}

  // Function to calculate the distance between the first and the last point
calculateDistance() {
    if (this.pickupPoints.length < 1) {
      this.messageService.showError('You need at least two pickup points.');
      return;
    }

    const firstPoint = this.pickupPoints[0];
    const lastPoint = this.pickupPoints[this.pickupPoints.length - 1];
    
    this.distance = (this.map.distance(firstPoint, lastPoint) / 1000); // distance in kilometers
  }
}
