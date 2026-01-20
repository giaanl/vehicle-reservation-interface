import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Reservation, ReservationStatus } from '../../../core/models/reservation.model';
import { getVehicleImageUrl } from '../../utils/vehicle-image.util';

dayjs.extend(utc);

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss',
})
export class ReservationCardComponent {
  @Input() reservation!: Reservation;
  @Output() cardClick = new EventEmitter<Reservation>();

  get vehicleImageUrl(): string | undefined {
    const name = this.reservation.vehicle?.name;
    return name ? getVehicleImageUrl(name) : undefined;
  }

  readonly statusLabels: Record<ReservationStatus, string> = {
    PENDING: 'Pendente',
    ACTIVE: 'Ativa',
    CANCELLED: 'Cancelada',
    COMPLETED: 'Concluída',
  };

  onCardClick(): void {
    this.cardClick.emit(this.reservation);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getStatusClass(): string {
    return `status-${this.reservation.status.toLowerCase()}`;
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return dayjs(date).format('DD/MM/YYYY');
  }
}
