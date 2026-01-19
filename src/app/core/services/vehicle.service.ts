import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../models/vehicle.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/vehicles`;

  getAll(): Observable<PaginatedResponse<Vehicle>> {
    let params = new HttpParams();
    return this.http.get<PaginatedResponse<Vehicle>>(this.API_URL, { params });
  }

  create(data: CreateVehicleRequest): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.API_URL, data);
  }

  update(id: string, data: UpdateVehicleRequest): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.API_URL}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
