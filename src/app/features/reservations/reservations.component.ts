import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass,
  heroAdjustmentsHorizontal,
  heroPlus,
  heroCalendar,
} from '@ng-icons/heroicons/outline';
import { MainLayoutComponent } from '../../shared/components/main-layout/main-layout.component';
import { FilterModalComponent, FilterValues } from '../../shared/components';
import { VehicleService } from '../../core/services/vehicle.service';
import { Reservation } from '../../core/models/reservation.model';
import { Vehicle } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIconComponent,
    MainLayoutComponent,
    FilterModalComponent,
  ],
  providers: [
    provideIcons({
      heroMagnifyingGlass,
      heroAdjustmentsHorizontal,
      heroPlus,
      heroCalendar,
    }),
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent {
  private vehicleService = inject(VehicleService);

  reservations: Reservation[] = [];
  vehicles: Vehicle[] = [];
  showModal = false;
  showFilterModal = false;
  selectedReservation: Reservation | null = null;
  errorMessage = '';
  searchQuery = '';

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

  get filteredReservations(): Reservation[] {
    if (!this.searchQuery.trim()) {
      return this.reservations;
    }
    const query = this.searchQuery.toLowerCase();
    return this.reservations.filter(
      (r) =>
        r.vehicle?.name?.toLowerCase().includes(query) ||
        r.vehicle?.type?.toLowerCase().includes(query),
    );
  }

  loadVehicles(): void {
    this.vehicleService.getAll().subscribe({
      next: (resp) => {
        this.vehicles = resp.data;
      },
      error: () => {},
    });
  }

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
    this.filters = filters;
    this.toggleFilterModal();
  }

  openCreateModal(): void {
    this.selectedReservation = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReservation = null;
  }
}
