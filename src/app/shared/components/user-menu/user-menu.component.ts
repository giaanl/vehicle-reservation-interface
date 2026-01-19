import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUser, heroPencilSquare, heroArrowRightOnRectangle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroUser, heroPencilSquare, heroArrowRightOnRectangle })],
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
