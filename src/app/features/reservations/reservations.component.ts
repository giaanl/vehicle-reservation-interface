import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
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
import {
  FilterModalComponent,
  FilterValues,
  ReservationCardComponent,
} from '../../shared/components';
import {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
} from '../../core/models/reservation.model';
import { ReservationService } from '../../core/services/reservation.service';
import { ReservationModalComponent } from './components/reservation-modal/reservation-modal.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIconComponent,
    MainLayoutComponent,
    FilterModalComponent,
    ReservationCardComponent,
    ReservationModalComponent,
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
export class ReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);

  reservations = signal<Reservation[]>([]);
  isLoading = signal(false);
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

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.reservationService.getAll().subscribe({
      next: (response) => {
        this.reservations.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Erro ao carregar reservas');
        this.isLoading.set(false);
        console.error('Erro ao carregar reservas:', error);
      },
    });
  }

  onSaveReservation(data: CreateReservationRequest | UpdateReservationRequest): void {
    if (this.selectedReservation()) {
      this.closeModal();
    } else {
      this.reservationService.create(data as CreateReservationRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadReservations();
        },
        error: (error) => {
          this.errorMessage.set('Erro ao criar reserva');
          console.error('Erro ao criar reserva:', error);
        },
      });
    }
  }

  openEditModal(reservation: Reservation): void {
    this.selectedReservation.set(reservation);
    this.showModal.set(true);
  }

  onDeleteReservation(): void {
    this.closeModal();
  }
}
