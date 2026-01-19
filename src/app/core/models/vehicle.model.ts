export interface Vehicle {
  id: string;
  name: string;
  year: string;
  type: string;
  engine: string;
  size: number;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
}

export interface CreateVehicleRequest {
  name: string;
  year: string;
  type: string;
  engine: string;
  size: string;
}

export interface UpdateVehicleRequest {
  name?: string;
  year?: string;
  type?: string;
  engine?: string;
  size?: string;
}
