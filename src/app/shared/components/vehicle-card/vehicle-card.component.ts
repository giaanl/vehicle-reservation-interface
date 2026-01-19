import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencil } from '@ng-icons/heroicons/outline';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroPencil })],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
})
export class VehicleCardComponent {
  @Input() vehicle!: Vehicle;
  @Input() showEditButton = false;
  @Output() cardClick = new EventEmitter<Vehicle>();
  @Output() editClick = new EventEmitter<Vehicle>();

  onCardClick(): void {
    this.cardClick.emit(this.vehicle);
  }

  onEditClick(event: Event): void {
    event.stopPropagation();
    this.editClick.emit(this.vehicle);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
