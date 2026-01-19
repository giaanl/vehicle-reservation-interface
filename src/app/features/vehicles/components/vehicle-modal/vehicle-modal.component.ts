import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroTruck, heroXMark } from '@ng-icons/heroicons/outline';
import {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroTruck, heroXMark })],
  templateUrl: './vehicle-modal.component.html',
  styleUrl: './vehicle-modal.component.scss',
})
export class VehicleModalComponent implements OnChanges {
  @Input() show = false;
  @Input() vehicle: Vehicle | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<
    CreateVehicleRequest | UpdateVehicleRequest
  >();

  vehicleTypes = [
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

  sizeOptions = [2, 3, 4, 5, 6, 7];

  formData = {
    name: '',
    year: new Date().getFullYear().toString(),
    type: '',
    engine: '',
    size: 5,
  };

  get isEditing(): boolean {
    return !!this.vehicle;
  }

  get title(): string {
    return this.isEditing ? 'Editar Veículo' : 'Novo Veículo';
  }

  ngOnChanges(): void {
    if (this.vehicle) {
      this.formData = {
        name: this.vehicle.name,
        year: this.vehicle.year,
        type: this.vehicle.type,
        engine: this.vehicle.engine,
        size: this.vehicle.size,
      };
    } else {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.formData = {
      name: '',
      year: new Date().getFullYear().toString(),
      type: '',
      engine: '',
      size: 5,
    };
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const data: CreateVehicleRequest | UpdateVehicleRequest = {
      name: this.formData.name,
      year: String(this.formData.year),
      type: this.formData.type,
      engine: this.formData.engine,
      size: String(this.formData.size),
    };

    this.save.emit(data);
  }

  isFormValid(): boolean {
    return (
      !!this.formData.name &&
      !!this.formData.year &&
      !!this.formData.type &&
      !!this.formData.engine &&
      this.formData.size > 0
    );
  }
}
