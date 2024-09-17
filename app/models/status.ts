export interface Status {
    id: number;
    name: string;
    code: string; 
    dateCreated: Date;
}

export interface StatusResponse {
    id: number;
    name: string;
    code: string; 
}

export interface StatusRequest {
    type: string;
    id: number;
    statusId: number;
    updatedBy: number; 
}
  
  
  