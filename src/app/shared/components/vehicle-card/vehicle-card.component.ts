import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
})
export class VehicleCardComponent {
  @Input() vehicle!: Vehicle;
  @Output() cardClick = new EventEmitter<Vehicle>();

  onCardClick(): void {
    this.cardClick.emit(this.vehicle);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
