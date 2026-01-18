import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';
import {
  AppHeaderComponent,
  FilterModalComponent,
  FilterValues,
  Vehicle,
  VehicleCardComponent,
} from '../../shared/components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppHeaderComponent,
    VehicleCardComponent,
    FilterModalComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  currentUser$ = this.authService.currentUser$;

  errorMessage = '';
  searchQuery = '';
  showFilterModal = false;
  activeNavItem = 'home';

  mockVehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Mini Cooper',
      year: 2021,
      type: 'Hatch compacto',
      engine: '1.8',
      size: 5,
      imageUrl: 'img/mini_cooper.png',
    },
    {
      id: '2',
      name: 'Jeep Compass',
      year: 2021,
      type: 'SUV Médio',
      engine: '1.8',
      size: 7,
      imageUrl: 'img/jeep_compass.png',
    },
  ];

  filters: FilterValues = {
    types: {
      hatchCompact: false,
      pickupMid: false,
      hatchMid: false,
      pickupMid2: false,
      suvCompact: false,
      sedanCompact: false,
      suvMid: false,
      sedanMid: false,
      suvLarge: false,
      sedanLarge: false,
      crossover: false,
      minivanMonovolume: false,
      coupe: false,
      utilityLight: false,
      pickupLight2: false,
      utility: false,
    },
    engine: '',
    size: null,
  };

  toggleFilterModal(): void {
    this.showFilterModal = !this.showFilterModal;
  }

  clearFilters(): void {
    this.filters = {
      types: {
        hatchCompact: false,
        pickupMid: false,
        hatchMid: false,
        pickupMid2: false,
        suvCompact: false,
        sedanCompact: false,
        suvMid: false,
        sedanMid: false,
        suvLarge: false,
        sedanLarge: false,
        crossover: false,
        minivanMonovolume: false,
        coupe: false,
        utilityLight: false,
        pickupLight2: false,
        utility: false,
      },
      engine: '',
      size: null,
    };
  }

  applyFilters(filters: FilterValues): void {
    this.toggleFilterModal();
  }

  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

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
