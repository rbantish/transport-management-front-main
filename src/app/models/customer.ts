export interface Customer {
  id?: number;
  name: string;
  email: string;
  phoneNumber: number;
  address: string;
  driverLicenseNumber?: string;
  customerTypeId: number;
  accountStatusId?: number;
  password: string;
  dateCreated?: Date;
}

export interface CustomerStatusResponse {
  customerId: number;
  customerName: string;
  customerType: string;
  phoneNumber: string;
  address: string;
  driverLicenseNumber: string;
  latestStatusId: number; // ID of the latest status
  latestStatusCode: string; // Code of the latest status
}

export interface UserInfo {
  id: number;
  driverLicenseNumber?: string;
  name: string;
  email: string;
  phoneNumber: number;
  address: string;
  type: string;
}
