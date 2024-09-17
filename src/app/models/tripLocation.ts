export interface TripLocation {
    id: number;
    locationPoint: string;
    order: number;
    dateCreated: Date;
  }
  

  export interface TripLocationResponse {
    id: number;
    locationPoint: string;
    order: number;
    updateDate: string;
}