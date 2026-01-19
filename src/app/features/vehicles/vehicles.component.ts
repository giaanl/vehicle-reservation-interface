import { Component, inject, OnInit } from '@angular/core';
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
} from '../../shared/components';
import { VehicleService } from '../../core/services/vehicle.service';
import { LoadingService } from '../../core/services/loading.service';
import {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../../core/models/vehicle.model';

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
})
export class VehiclesComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private loadingService = inject(LoadingService);

  vehicles: Vehicle[] = [];
  showModal = false;
  showFilterModal = false;
  selectedVehicle: Vehicle | null = null;
  errorMessage = '';
  searchQuery = '';

  filters: FilterValues = {
    types: {},
    engine: '',
    size: null,
    status: 'all',
  };

  get filteredVehicles(): Vehicle[] {
    let result = this.vehicles;

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.type.toLowerCase().includes(query),
      );
    }

    const selectedTypes = Object.entries(this.filters.types)
      .filter(([_, selected]) => selected)
      .map(([key]) => key);

    if (selectedTypes.length > 0) {
      result = result.filter((v) => {
        const typeKey = this.getTypeKey(v.type);
        return selectedTypes.includes(typeKey);
      });
    }

    if (this.filters.engine) {
      result = result.filter((v) => v.engine === this.filters.engine);
    }

    if (this.filters.size !== null) {
      result = result.filter((v) => v.size === this.filters.size);
    }

    return result;
  }

  get vehiclesWithImage(): (Vehicle & { imageUrl?: string | null })[] {
    return this.filteredVehicles.map((v) => ({
      ...v,
      imageUrl: this.getVehicleImageUrl(v.name),
    }));
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loadingService.show();
    this.vehicleService.getAll().subscribe({
      next: (resp) => {
        this.vehicles = resp.data ?? [];
        this.loadingService.hide();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao carregar veículos';
        this.loadingService.hide();
      },
    });
  }

  toggleFilterModal(): void {
    this.showFilterModal = !this.showFilterModal;
  }

  applyFilters(filters: FilterValues): void {
    this.filters = filters;
    this.showFilterModal = false;
    this.loadVehicles();
  }

  clearFilters(): void {
    this.filters = {
      types: {},
      engine: '',
      size: null,
      status: 'all',
    };
    this.loadVehicles();
  }

  openCreateModal(): void {
    this.selectedVehicle = null;
    this.showModal = true;
  }

  openEditModal(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedVehicle = null;
  }

  onSaveVehicle(data: CreateVehicleRequest | UpdateVehicleRequest): void {
    this.loadingService.show();

    if (this.selectedVehicle) {
      this.vehicleService
        .update(this.selectedVehicle.id, data as UpdateVehicleRequest)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadVehicles();
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message || 'Erro ao atualizar veículo';
            this.loadingService.hide();
          },
        });
    } else {
      this.vehicleService.create(data as CreateVehicleRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadVehicles();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao criar veículo';
          this.loadingService.hide();
        },
      });
    }
  }

  onDeleteVehicle(vehicle: Vehicle): void {
    if (!confirm(`Tem certeza que deseja excluir o veículo "${vehicle.name}"?`))
      return;

    this.loadingService.show();
    this.vehicleService.delete(vehicle.id).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao excluir veículo';
        this.loadingService.hide();
      },
    });
  }

  getStatusLabel(status?: string): string {
    return status === 'reserved' ? 'Reservado' : 'Disponível';
  }

  getStatusClass(status?: string): string {
    return status === 'reserved' ? 'status-reserved' : 'status-available';
  }

  private availableImages = [
    'chevrolet_camaro',
    'fiat_doblo',
    'fiat_fiorino',
    'ford_ka',
    'ford_ka_sedan',
    'jeep_compass',
    'mini_cooper',
    'nissan_versa',
    'peugeot_partner',
    'renault_duster',
    'vw_jetta',
    'vw_tcross',
  ];

  private modelToImage: Record<string, string> = {
    camaro: 'chevrolet_camaro',
    doblo: 'fiat_doblo',
    fiorino: 'fiat_fiorino',
    ka: 'ford_ka',
    ka_sedan: 'ford_ka_sedan',
    compass: 'jeep_compass',
    mini_cooper: 'mini_cooper',
    versa: 'nissan_versa',
    partner: 'peugeot_partner',
    duster: 'renault_duster',
    jetta: 'vw_jetta',
    tcross: 'vw_tcross',
  };

  private normalizeModel(model: string): string {
    return model
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s_-]/g, '')
      .trim()
      .replace(/\s+/g, '_');
  }

  getVehicleImageUrl(modelName: string): string | undefined {
    const key = this.normalizeModel(modelName);

    const mapped = this.modelToImage[key];
    if (mapped) return `img/${mapped}.png`;

    const matched = this.availableImages.find(
      (img) =>
        img.endsWith(`_${key}`) ||
        img.includes(`_${key}_`) ||
        img.includes(key),
    );

    return matched ? `img/${matched}.png` : undefined;
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
