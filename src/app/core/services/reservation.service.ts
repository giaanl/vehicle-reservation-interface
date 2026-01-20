import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
} from '../models/reservation.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/reservations`;

  getAll(): Observable<PaginatedResponse<Reservation>> {
    return this.http.get<PaginatedResponse<Reservation>>(this.API_URL);
  }

  create(data: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.API_URL, data);
  }

  cancel(id: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.API_URL}/${id}/cancel`, {});
  }

  complete(id: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.API_URL}/${id}/complete`, {});
  }
}
