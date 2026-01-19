import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCalendar, heroTruck } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [provideIcons({ heroCalendar, heroTruck })],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuItems = [
    {
      label: 'Reservas',
      route: '/reservations',
      icon: 'heroCalendar',
    },
    {
      label: 'Veículos',
      route: '/vehicles',
      icon: 'heroTruck',
    },
  ];
}
