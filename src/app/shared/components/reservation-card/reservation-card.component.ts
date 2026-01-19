import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Reservation, ReservationStatus } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss',
})
export class ReservationCardComponent {
  @Input() reservation!: Reservation;
  @Output() cardClick = new EventEmitter<Reservation>();

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
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }
}
