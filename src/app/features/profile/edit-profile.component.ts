import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { LoadingService } from '../../core/services/loading.service';
import { User } from '../../core/models/user.model';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppHeaderComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  profileForm!: FormGroup;
  currentUser: User | null = null;
  errorMessage = '';
  successMessage = '';
  showDeleteModal = false;
  showPasswordFields = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.profileForm = this.fb.group({
      name: [
        this.currentUser.name,
        [Validators.required, Validators.minLength(3)],
      ],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
    });
  }

  togglePasswordFields(): void {
    this.showPasswordFields = !this.showPasswordFields;

    if (!this.showPasswordFields) {
      this.profileForm.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }

  get nameError(): string {
    const control = this.profileForm.get('name');
    if (control?.hasError('required') && control.touched) {
      return 'Nome é obrigatório';
    }
    if (control?.hasError('minlength') && control.touched) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }
    return '';
  }

  get emailError(): string {
    const control = this.profileForm.get('email');
    if (control?.hasError('required') && control.touched) {
      return 'Email é obrigatório';
    }
    if (control?.hasError('email') && control.touched) {
      return 'Email inválido';
    }
    return '';
  }

  get passwordError(): string {
    const newPassword = this.profileForm.get('newPassword');
    const confirmPassword = this.profileForm.get('confirmPassword');

    if (newPassword?.hasError('minlength') && newPassword.touched) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }

    if (
      confirmPassword?.value &&
      newPassword?.value !== confirmPassword?.value &&
      confirmPassword.touched
    ) {
      return 'As senhas não coincidem';
    }

    return '';
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { name, email, currentPassword, newPassword, confirmPassword } =
      this.profileForm.value;

    if (this.showPasswordFields) {
      if (!currentPassword) {
        this.errorMessage = 'Senha atual é obrigatória para alteração de senha';
        return;
      }
      if (newPassword !== confirmPassword) {
        this.errorMessage = 'As senhas não coincidem';
        return;
      }
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.loadingService.show();

    const updateData: any = { name, email };

    if (this.showPasswordFields && newPassword) {
      updateData.password = newPassword;
    }

    this.userService.updateProfile(updateData).subscribe({
      next: (user) => {
        this.loadingService.hide();
        this.successMessage = 'Perfil atualizado com sucesso!';
        this.showPasswordFields = false;
        this.profileForm.patchValue({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => (this.successMessage = ''), 5000);
      },
      error: (error) => {
        this.loadingService.hide();
        this.errorMessage =
          error.error?.message || 'Erro ao atualizar perfil. Tente novamente.';
      },
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    this.loadingService.show();
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout().subscribe({
          next: () => {
            this.loadingService.hide();
            this.router.navigate(['/auth/login']);
          },
          error: () => {},
        });
      },
      error: (error) => {
        this.loadingService.hide();
        this.errorMessage =
          error.error?.message || 'Erro ao excluir conta. Tente novamente.';
        this.closeDeleteModal();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.loadingService.show();
    this.authService.logout().subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loadingService.hide();
        this.errorMessage =
          error.error?.message || 'Erro ao realizar o logout. Tente novamente.';
      },
    });
  }
}
