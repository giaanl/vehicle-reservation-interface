import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  currentUser$ = this.authService.currentUser$;

  errorMessage = '';

  logout(): void {
    this.loadingService.show();
    this.authService.logout().subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loadingService.hide();
        this.errorMessage =
          error.error?.message || 'Erro ao realizar o logout. Tente novamente.';
      },
    });
  }
}
