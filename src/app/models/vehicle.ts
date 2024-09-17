import { VehicleType } from "./vehicleType";

export interface Vehicle {
    id: number;
    vehicleTypeId: number;
    dailyPrice: number; 
    tripPrice: number;
    seats: number;
    make: string;  
    model: string;  
    year: number;
    carNumber: string;  
    currentLocation: string;  
    dateCreated: Date;
    vehicleType?: VehicleType
  }

  export interface VehicleRequest {
    vehicleTypeId: string;
    tripPrice: string;
    dailyPrice: string; 
    seats: string;
    updatedBy: string;
    imagePath: string;
    make: string;  
    model: string;  
    year: string;
    carNumber: string;  
    currentLocation: string;
  }
  
  export interface VehicleResponse {
    id: number;
    vehicleTypeCode: string;
    dailyPrice: number; 
    seats: number;
    tripPrice: number;
    make: string;  
    model: string;  
    imagePath: string;
    year: number;
    carNumber: string;  
    currentLocation: string;  
    vehicleStatusCode?: string;
    rentalStatusCode?: string;
  }

  
  export interface Item{
    date: Date;
}
