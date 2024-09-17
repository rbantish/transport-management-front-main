export interface Payment {
    id?: number;
    customerId?: number;
    rentalId?: number;
    tripId?: number;
    paymentMethodId: number;
    paymentStatusId: number;
    paymentDate: Date;
    amount: number; 
    dateCreated: Date;
  }
  