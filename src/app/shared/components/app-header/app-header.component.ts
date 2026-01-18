import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UserMenuComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  @Input() userName?: string;
  @Output() editProfile = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onEditProfile(): void {
    this.editProfile.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
