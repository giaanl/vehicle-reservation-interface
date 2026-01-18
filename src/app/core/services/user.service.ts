import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface UpdateProfileRequest {
  name: string;
  email: string;
  newPassword?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly API_URL = `${environment.apiUrl}/users`;

  updateProfile(data: UpdateProfileRequest): Observable<User> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    return this.http
      .patch<User>(`${this.API_URL}/${currentUser.id}`, data)
      .pipe(
        tap(() => {
          this.authService.checkAuthStatus();
        }),
      );
  }

  deleteAccount(): Observable<void> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.delete<void>(`${this.API_URL}/${currentUser.id}`);
  }
}
