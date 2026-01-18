import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
  @Output() editProfile = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  showMenu = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.user-profile');

    if (!clickedInside && this.showMenu) {
      this.showMenu = false;
    }
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  onEditProfile(): void {
    this.showMenu = false;
    this.editProfile.emit();
  }

  onLogout(): void {
    this.showMenu = false;
    this.logout.emit();
  }
}
