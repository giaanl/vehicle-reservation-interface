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
} from '../../core/models/reservation.model';
import { ReservationService } from '../../core/services/reservation.service';
import { ToastService } from '../../core/services/toast.service';
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
  private toastService = inject(ToastService);

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
    status: null,
  });

  filteredReservations = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const currentFilters = this.filters();

    return this.reservations().filter((r) => {
      if (query) {
        const matchesQuery =
          r.vehicle?.name?.toLowerCase().includes(query) ||
          r.vehicle?.type?.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      if (currentFilters.status && r.status !== currentFilters.status) {
        return false;
      }

      return true;
    });
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
      status: null,
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
        const errorMsg = error.error?.message || 'Erro ao carregar reservas';
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
        this.toastService.error(errorMsg);
      },
    });
  }

  onSaveReservation(data: CreateReservationRequest): void {
    this.reservationService.create(data).subscribe({
      next: () => {
        this.closeModal();
        this.loadReservations();
        this.toastService.success('Reserva criada com sucesso!');
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Erro ao criar reserva';
        this.errorMessage.set(errorMsg);
        this.toastService.error(errorMsg);
      },
    });
  }

  openEditModal(reservation: Reservation): void {
    this.selectedReservation.set(reservation);
    this.showModal.set(true);
  }

  onCancelReservation(id: string): void {
    this.reservationService.cancel(id).subscribe({
      next: () => {
        this.closeModal();
        this.loadReservations();
        this.toastService.success('Reserva cancelada com sucesso!');
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Erro ao cancelar reserva';
        this.errorMessage.set(errorMsg);
        this.toastService.error(errorMsg);
      },
    });
  }

  onCompleteReservation(id: string): void {
    this.reservationService.complete(id).subscribe({
      next: () => {
        this.closeModal();
        this.loadReservations();
        this.toastService.success('Reserva finalizada com sucesso!');
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Erro ao finalizar reserva';
        this.errorMessage.set(errorMsg);
        this.toastService.error(errorMsg);
      },
    });
  }
}
