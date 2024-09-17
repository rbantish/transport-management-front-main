export interface Driver {
    id: number;
    name: string;
    phoneNumber: string;
    licenseNumber: string;
    dateCreated: Date;
}
  
export interface DriverRequest {
    name: string;
    phoneNumber: number;
    password: string; 
    licenseNumber: string;
}


export interface DriverResponse {
    driverId: number;
    driverName: string;
    driverPhoneNumber: string;
    driverLicenseNumber: string;
    driverCreationDate: Date;
}

export interface DriverWithStatus extends DriverResponse {
    latestStatusName: string;
    latestStatusCode: string;
    statusUpdateDate: Date;
}
