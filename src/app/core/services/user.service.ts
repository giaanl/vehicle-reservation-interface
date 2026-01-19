import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UpdateProfilePatchRequest, User } from '../models/user.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly API_URL = `${environment.apiUrl}/users`;

  updateProfile(data: UpdateProfilePatchRequest): Observable<User> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    return this.http
      .patch<User>(`${this.API_URL}`, data)
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

    return this.http.delete<void>(`${this.API_URL}`);
  }
}
