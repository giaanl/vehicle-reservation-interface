import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  DestroyRef,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass,
  heroAdjustmentsHorizontal,
  heroPlus,
  heroTruck,
} from '@ng-icons/heroicons/outline';
import { MainLayoutComponent } from '../../shared/components/main-layout/main-layout.component';
import { VehicleModalComponent } from './components/vehicle-modal/vehicle-modal.component';
import {
  FilterModalComponent,
  FilterValues,
  VehicleCardComponent,
  ConfirmModalComponent,
} from '../../shared/components';
import { VehicleService } from '../../core/services/vehicle.service';
import { LoadingService } from '../../core/services/loading.service';
import { ToastService } from '../../core/services/toast.service';
import {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../../core/models/vehicle.model';
import { getVehicleImageUrl } from '../../shared/utils/vehicle-image.util';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIconComponent,
    MainLayoutComponent,
    VehicleModalComponent,
    FilterModalComponent,
    VehicleCardComponent,
    ConfirmModalComponent,
  ],
  providers: [
    provideIcons({
      heroMagnifyingGlass,
      heroAdjustmentsHorizontal,
      heroPlus,
      heroTruck,
    }),
  ],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  vehicles = signal<Vehicle[]>([]);
  showModal = signal(false);
  showFilterModal = signal(false);
  showDeleteModal = signal(false);
  selectedVehicle = signal<Vehicle | null>(null);
  vehicleToDelete = signal<Vehicle | null>(null);
  errorMessage = signal('');
  searchQuery = signal('');
  filters = signal<FilterValues>({
    types: {},
    engine: '',
    size: null,
    available: null,
  });

  filteredVehicles = computed(() => {
    let result = this.vehicles();
    const query = this.searchQuery().trim().toLowerCase();
    const currentFilters = this.filters();

    if (query) {
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.type.toLowerCase().includes(query),
      );
    }

    const selectedTypes = Object.entries(currentFilters.types)
      .filter(([_, selected]) => selected)
      .map(([key]) => key);

    if (selectedTypes.length > 0) {
      result = result.filter((v) => {
        const typeKey = this.getTypeKey(v.type);
        return selectedTypes.includes(typeKey);
      });
    }

    if (currentFilters.engine) {
      result = result.filter((v) => v.engine === currentFilters.engine);
    }

    if (currentFilters.size !== null) {
      result = result.filter((v) => v.size === currentFilters.size);
    }

    if (currentFilters.available !== null && currentFilters.available !== undefined) {
      result = result.filter((v) => v.available === currentFilters.available);
    }

    return result;
  });

  vehiclesWithImage = computed(() => {
    return this.filteredVehicles().map((v) => ({
      ...v,
      imageUrl: getVehicleImageUrl(v.name),
    }));
  });

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loadingService.show();
    this.vehicleService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resp) => {
          this.vehicles.set(resp.data ?? []);
          this.loadingService.hide();
        },
        error: (error) => {
          const errorMsg = error.error?.message || 'Erro ao carregar veículos';
          this.errorMessage.set(errorMsg);
          this.loadingService.hide();
          this.toastService.error(errorMsg);
        },
      });
  }

  toggleFilterModal(): void {
    this.showFilterModal.update((v) => !v);
  }

  applyFilters(filters: FilterValues): void {
    this.filters.set(filters);
    this.showFilterModal.set(false);
  }

  clearFilters(): void {
    this.filters.set({
      types: {},
      engine: '',
      size: null,
      available: null,
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  openCreateModal(): void {
    this.selectedVehicle.set(null);
    this.showModal.set(true);
  }

  openEditModal(vehicle: Vehicle): void {
    this.selectedVehicle.set(vehicle);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedVehicle.set(null);
  }

  onSaveVehicle(data: CreateVehicleRequest | UpdateVehicleRequest): void {
    this.loadingService.show();
    const currentVehicle = this.selectedVehicle();

    if (currentVehicle) {
      this.vehicleService
        .update(currentVehicle.id, data as UpdateVehicleRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadVehicles();
            this.toastService.success('Veículo atualizado com sucesso!');
          },
          error: (error) => {
            const errorMsg = error.error?.message || 'Erro ao atualizar veículo';
            this.errorMessage.set(errorMsg);
            this.loadingService.hide();
            this.toastService.error(errorMsg);
          },
        });
    } else {
      this.vehicleService
        .create(data as CreateVehicleRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadVehicles();
            this.toastService.success('Veículo criado com sucesso!');
          },
          error: (error) => {
            const errorMsg = error.error?.message || 'Erro ao criar veículo';
            this.errorMessage.set(errorMsg);
            this.loadingService.hide();
            this.toastService.error(errorMsg);
          },
        });
    }
  }

  openDeleteModal(): void {
    const vehicle = this.selectedVehicle();
    if (vehicle) {
      this.vehicleToDelete.set(vehicle);
      this.showModal.set(false);
      this.showDeleteModal.set(true);
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.vehicleToDelete.set(null);
  }

  confirmDelete(): void {
    const vehicle = this.vehicleToDelete();
    if (!vehicle) return;

    this.loadingService.show();
    this.vehicleService
      .delete(vehicle.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.closeDeleteModal();
          this.selectedVehicle.set(null);
          this.loadVehicles();
          this.toastService.success('Veículo excluído com sucesso!');
        },
        error: (error) => {
          const errorMsg = error.error?.message || 'Erro ao excluir veículo';
          this.errorMessage.set(errorMsg);
          this.loadingService.hide();
          this.toastService.error(errorMsg);
        },
      });
  }

  getStatusLabel(status?: string): string {
    return status === 'reserved' ? 'Reservado' : 'Disponível';
  }

  getStatusClass(status?: string): string {
    return status === 'reserved' ? 'status-reserved' : 'status-available';
  }

  private getTypeKey(type: string): string {
    const typeMap: { [key: string]: string } = {
      'Hatch compacto': 'hatchCompact',
      'Hatch médio': 'hatchMid',
      'Sedan compacto': 'sedanCompact',
      'Sedan médio': 'sedanMid',
      'Sedan grande': 'sedanLarge',
      'SUV compacto': 'suvCompact',
      'SUV médio': 'suvMid',
      'SUV grande': 'suvLarge',
      'Pickup média': 'pickupMid',
      'Pickup grande': 'pickupLarge',
      Crossover: 'crossover',
      Coupé: 'coupe',
      'Minivan/Monovolume': 'minivan',
      'Utilitário leve': 'utilityLight',
      Utilitário: 'utility',
    };
    return typeMap[type] || type.toLowerCase().replace(/\s+/g, '');
  }
}
