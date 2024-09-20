import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer, CustomerStatusResponse, UserInfo } from '../models/customer';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Item, Vehicle, VehicleRequest, VehicleResponse } from '../models/vehicle';
import { BookingInfos, PaymentCompleteRequest, RentalRequest, TripRental } from '../models/rental';
import { PaymentResponse } from '../models/paymentMethod';
import { TriAddDriverRequest, TripRequest, TripWithVehicle } from '../models/trip';
import { AdminRequest } from '../models/admin';
import { VehicleType } from '../models/vehicleType';
import { StatusRequest, StatusResponse } from '../models/status';
import { DriverRequest, DriverResponse } from '../models/driver';
import { TripLocationResponse } from '../models/tripLocation';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  retrieveDriversCount(): number | PromiseLike<number> {
    return firstValueFrom(this.http.get<number>(`${this.url}/info/drivers/count`));
  }

  retrieveTripsAndRentalCount(): number | PromiseLike<number> {
    return firstValueFrom(this.http.get<number>(`${this.url}/info/tripsrental/count`));
  }

  retrieveVehiclesCount(): number | PromiseLike<number> {
    return firstValueFrom(this.http.get<number>(`${this.url}/info/vehicles/count`));
  }

  retrieveMoneyThisMonth(): number | PromiseLike<number> {
    return firstValueFrom(this.http.get<number>(`${this.url}/info/money/this-month`));
  }

  addDriver(request: DriverRequest) {
    return firstValueFrom(this.http.post<string>(`${this.url}/driver/add`, request,{ observe: 'response' }));
  }

  updatePayment(request: PaymentCompleteRequest) {
    return firstValueFrom(this.http.post<string>(`${this.url}/rental/payment`, request,{ observe: 'response' }));
  }

  retrieveLocationsByTripId(tripId: number) {
    return firstValueFrom(this.http.get<Array<TripLocationResponse>>(`${this.url}/driver/trip/${tripId}/locations`));
  }

  retrieveAllRentalAndTrip() {
    return firstValueFrom(this.http.get<Array<TripRental>>(`${this.url}/rental/trips-rentals`));
  }

  retrieveAllTripsForADriver(driverId: number){
    let params: HttpParams = new HttpParams().set("driverId",driverId);
    return firstValueFrom(this.http.get<Array<TripWithVehicle>>(`${this.url}/driver/trip/all`,{params}));
  }

  retrieveAllDrivers() {
    return firstValueFrom(this.http.get<Array<DriverResponse>>(`${this.url}/driver/all`));
  }

  getVehicleById(vehicleId: string) {
    let params: HttpParams = new HttpParams().set("id",vehicleId);
    return firstValueFrom(this.http.get<VehicleResponse>(`${this.url}/vehicle/single`,{params}));
  }
  getCalendarForThisVehicle(vehicleId: string) {
    let params: HttpParams = new HttpParams().set("id",vehicleId);
    return firstValueFrom(this.http.get<Array<Item>>(`${this.url}/vehicle/calendar`,{params}));
  }
  retrieveAllCars() {
    return firstValueFrom(this.http.get<Array<VehicleResponse>>(`${this.url}/vehicle/all`));
  }
  login(customer: Customer) {
    return firstValueFrom(this.http.post<string | UserInfo>(`${this.url}/customer/login`, customer,{ observe: 'response' }));
  }

  loginCustomer(customer: Customer) {
    return firstValueFrom(this.http.post<string | UserInfo>(`${this.url}/driver/login`, customer,{ observe: 'response' }));
  }

  retrieveAllVehicleType() {
    return firstValueFrom(this.http.get<Array<VehicleType>>(`${this.url}/vehicle/vehicletype/all`));
  }

  retrieveAllVehicles() {
    return firstValueFrom(this.http.get<Array<VehicleResponse>>(`${this.url}/vehicle/all`));
  }

  retrieveAllStatuses() {
    return firstValueFrom(this.http.get<Array<StatusResponse>>(`${this.url}/status/all`));
  }

  retrieveAllCustomers() {
    return firstValueFrom(this.http.get<Array<CustomerStatusResponse>>(`${this.url}/customer/all-with-status`));
  }


  adminLogin(customer: AdminRequest) {
    return firstValueFrom(this.http.post(`${this.url}/admin/login`, customer,{ observe: 'response' }));
  }


  async addCustomer(customer: Customer){
    return firstValueFrom(this.http.post(`${this.url}/customer/add`, customer,{ observe: 'response' }));
  }

  async addDriverToTrip(request: TriAddDriverRequest){
    return firstValueFrom(this.http.post(`${this.url}/trip/add-driver`, request,{ observe: 'response' }));
  }

  async addRental(customer: RentalRequest){
    return firstValueFrom(this.http.post<string>(`${this.url}/rental/add`, customer,{ observe: 'response' }));
  }

  updateStatus(request: StatusRequest) {
    return firstValueFrom(this.http.post<string>(`${this.url}/status/add-status`, request,{ observe: 'response' }));
  }

  async addVehicle(vehicleData: VehicleRequest, imageFile: File, updatedBy: string) {
    const formData = new FormData();

    // Append the image file
    formData.append('image', imageFile);
    console.log(vehicleData.vehicleTypeId,"id")
    // Append the rest of the vehicle data
    formData.append('vehicleTypeId', vehicleData.vehicleTypeId);
    formData.append('tripPrice', vehicleData.tripPrice);
    formData.append('dailyPrice', vehicleData.dailyPrice);
    formData.append('updatedBy', updatedBy);
    formData.append('seats', vehicleData.seats);
    formData.append('carNumber', vehicleData.carNumber);
    formData.append('make', vehicleData.make);
    formData.append('model', vehicleData.model);
    formData.append('year', vehicleData.year);
    formData.append('currentLocation', vehicleData.currentLocation);
    // Send POST request with form data
    return firstValueFrom(this.http.post<string>(`${this.url}/vehicle/add`, formData,{ observe: 'response' }));
  }

  async addTrip(trip: TripRequest){
    return firstValueFrom(this.http.post<string>(`${this.url}/trip/add`, trip,{ observe: 'response' }));
  }

  async getBookings(customerId: number){
    let params: HttpParams = new HttpParams().set("id",customerId);
    return firstValueFrom(this.http.get<Array<BookingInfos>>(`${this.url}/rental/bookings`, {params}));
  }

  async getPaymentMethods(){
    return firstValueFrom(this.http.get<Array<PaymentResponse>>(`${this.url}/payment/all`));
  }
  

  async modifyCustomer(customer: Customer){
    return firstValueFrom(this.http.put(`${this.url}/customer/modify`, customer,{ observe: 'response' }));
  }
}
