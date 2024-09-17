export interface Trip {
    id?: number;
    vehicleId: number;
    customerId: number;
    driverId?: number;
    tripStatusId: number;
    tripDate: Date;
    tripCost: number;  // double
    dateCreated: Date;
  }

  export interface TripWithVehicle {
    tripId: number;
    tripCost: number;
    tripDate: Date;
    dateCreated: Date;
    updateDate: Date;
    carNumber: string;
    make: string;
    model: string;
  }
  
  export interface TriAddDriverRequest{
    tripId: number;
    driverId: number;
  }


  export interface TripRequest {
    vehicleId: number;
    customerId: number;
    paymentMethodId: number;
    tripDate: Array<Date>;
    tripCost: number; 
    points: Array<string>;
  }
