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
import { heroTruck, heroXMark, heroTrash } from '@ng-icons/heroicons/outline';
import {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroTruck, heroXMark, heroTrash })],
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
  @Output() delete = new EventEmitter<void>();

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

  private originalData: typeof this.formData | null = null;

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
      this.originalData = { ...this.formData };
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
    this.originalData = null;
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    if (this.isEditing && this.originalData) {
      const updateData: UpdateVehicleRequest = {};

      if (this.formData.name !== this.originalData.name) {
        updateData.name = this.formData.name;
      }
      if (String(this.formData.year) !== String(this.originalData.year)) {
        updateData.year = String(this.formData.year);
      }
      if (this.formData.type !== this.originalData.type) {
        updateData.type = this.formData.type;
      }
      if (this.formData.engine !== this.originalData.engine) {
        updateData.engine = this.formData.engine;
      }
      if (this.formData.size !== this.originalData.size) {
        updateData.size = String(this.formData.size);
      }

      if (Object.keys(updateData).length === 0) {
        this.close.emit();
        return;
      }

      this.save.emit(updateData);
    } else {
      const createData: CreateVehicleRequest = {
        name: this.formData.name,
        year: String(this.formData.year),
        type: this.formData.type,
        engine: this.formData.engine,
        size: String(this.formData.size),
      };

      this.save.emit(createData);
    }
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

  onDelete(): void {
    this.delete.emit();
  }
}
