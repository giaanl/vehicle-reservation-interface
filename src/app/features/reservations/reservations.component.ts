import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
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
import { Reservation } from '../../core/models/reservation.model';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsComponent {
  reservations = signal<Reservation[]>([]);
  showModal = signal(false);
  showFilterModal = signal(false);
  selectedReservation = signal<Reservation | null>(null);
  errorMessage = signal('');
  searchQuery = signal('');

  filters = signal<FilterValues>({
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
  });

  filteredReservations = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.reservations();
    }
    return this.reservations().filter(
      (r) =>
        r.vehicle?.name?.toLowerCase().includes(query) ||
        r.vehicle?.type?.toLowerCase().includes(query),
    );
  });

  toggleFilterModal(): void {
    this.showFilterModal.update((v) => !v);
  }

  clearFilters(): void {
    this.filters.set({
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
    });
  }

  applyFilters(filters: FilterValues): void {
    this.filters.set(filters);
    this.toggleFilterModal();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  openCreateModal(): void {
    this.selectedReservation.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedReservation.set(null);
  }
}
