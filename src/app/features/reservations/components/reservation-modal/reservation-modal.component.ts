import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCalendar,
  heroXMark,
  heroArrowLeft,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';
import {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
} from '../../../../core/models/reservation.model';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { getVehicleImageUrl } from '../../../../shared/utils/vehicle-image.util';

type ModalStep = 'select-vehicle' | 'select-dates';

@Component({
  selector: 'app-reservation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [
    provideIcons({
      heroCalendar,
      heroXMark,
      heroArrowLeft,
      heroMagnifyingGlass,
    }),
  ],
  templateUrl: './reservation-modal.component.html',
  styleUrl: './reservation-modal.component.scss',
})
export class ReservationModalComponent implements OnChanges {
  private vehicleService = inject(VehicleService);

  @Input() show = false;
  @Input() reservation: Reservation | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<
    CreateReservationRequest | UpdateReservationRequest
  >();

  vehicles = signal<Vehicle[]>([]);
  isLoadingVehicles = signal(false);

  currentStep = signal<ModalStep>('select-vehicle');
  selectedVehicle = signal<Vehicle | null>(null);
  searchQuery = signal('');

  filters = signal({
    engine: '',
    type: '',
    size: null as number | null,
  });

  formData = {
    startDate: '',
    endDate: '',
  };

  readonly engineOptions = ['1.0', '1.4', '1.6', '1.8', '2.0', '2.5', '3.0'];
  readonly typeOptions = [
    'Hatch compacto',
    'Hatch médio',
    'Sedan compacto',
    'Sedan médio',
    'Sedan grande',
    'SUV compacto',
    'SUV médio',
    'SUV grande',
    'Pickup média',
    'Pickup grande',
    'Crossover',
    'Coupé',
    'Minivan/Monovolume',
    'Utilitário leve',
    'Utilitário',
  ];
  readonly sizeOptions = [2, 3, 4, 5, 6, 7];

  filteredVehicles = computed(() => {
    let result = this.vehicles();
    const query = this.searchQuery().toLowerCase().trim();
    const { engine, type, size } = this.filters();

    if (query) {
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.type.toLowerCase().includes(query),
      );
    }

    if (engine) {
      result = result.filter((v) => v.engine === engine);
    }

    if (type) {
      result = result.filter((v) => v.type === type);
    }

    if (size !== null) {
      result = result.filter((v) => Number(v.size) === size);
    }

    return result.map((v) => ({
      ...v,
      imageUrl: getVehicleImageUrl(v.name),
    }));
  });

  get isEditing(): boolean {
    return !!this.reservation;
  }

  get title(): string {
    if (this.isEditing) return 'Editar Reserva';
    return this.currentStep() === 'select-vehicle'
      ? 'Selecione um Veículo'
      : 'Escolha as Datas';
  }

  get minStartDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  get minEndDate(): string {
    return this.formData.startDate || this.minStartDate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      if (this.vehicles().length === 0) {
        this.loadVehicles();
      }
    }

    if (this.reservation) {
      this.selectedVehicle.set(this.reservation.vehicle || null);
      this.formData = {
        startDate: this.formatDateForInput(this.reservation.startDate),
        endDate: this.reservation.endDate
          ? this.formatDateForInput(this.reservation.endDate)
          : '',
      };
      this.currentStep.set('select-dates');
    } else {
      this.resetForm();
    }
  }

  loadVehicles(): void {
    this.isLoadingVehicles.set(true);
    this.vehicleService.getAll({ available: true }).subscribe({
      next: (response) => {
        this.vehicles.set(response.data);
        this.isLoadingVehicles.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar veículos:', error);
        this.isLoadingVehicles.set(false);
      },
    });
  }

  private formatDateForInput(date: string): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  resetForm(): void {
    this.currentStep.set('select-vehicle');
    this.selectedVehicle.set(null);
    this.searchQuery.set('');
    this.filters.set({ engine: '', type: '', size: null });
    this.formData = {
      startDate: '',
      endDate: '',
    };
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onFilterChange(key: 'engine' | 'type', value: string): void {
    this.filters.update((f) => ({ ...f, [key]: value }));
  }

  onSizeFilterChange(value: string): void {
    this.filters.update((f) => ({
      ...f,
      size: value ? parseInt(value, 10) : null,
    }));
  }

  clearFilters(): void {
    this.filters.set({ engine: '', type: '', size: null });
    this.searchQuery.set('');
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle.set(vehicle);
    this.currentStep.set('select-dates');
  }

  goBackToVehicles(): void {
    this.currentStep.set('select-vehicle');
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const vehicle = this.selectedVehicle();
    if (!vehicle) return;

    const createData: CreateReservationRequest = {
      vehicleId: vehicle.id,
      startDate: this.formData.startDate,
      endDate: this.formData.endDate || undefined,
    };

    this.save.emit(createData);
  }

  isFormValid(): boolean {
    return !!this.selectedVehicle() && !!this.formData.startDate;
  }
}
