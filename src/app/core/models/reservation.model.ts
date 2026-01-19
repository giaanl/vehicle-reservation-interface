import { Vehicle } from './vehicle.model';
import { User } from './user.model';

export type ReservationStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Reservation {
  id: string;
  vehicleId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  vehicle?: Vehicle;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReservationRequest {
  vehicleId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateReservationRequest {
  startDate?: string;
  endDate?: string;
}
