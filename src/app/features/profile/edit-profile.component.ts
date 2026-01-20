import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  DestroyRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroChevronLeft,
  heroUser,
  heroKey,
  heroTrash,
  heroExclamationTriangle,
} from '@ng-icons/heroicons/outline';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { LoadingService } from '../../core/services/loading.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models/user.model';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { switchMap } from 'rxjs';
import { ConfirmModalComponent } from '../../shared/components';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    NgIconComponent,
    ConfirmModalComponent,
  ],
  providers: [
    provideIcons({
      heroChevronLeft,
      heroUser,
      heroKey,
      heroTrash,
      heroExclamationTriangle,
    }),
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  profileForm!: FormGroup;
  currentUser: User | null = null;
  errorMessage = signal('');
  successMessage = signal('');
  showDeleteModal = signal(false);
  showPasswordFields = signal(false);

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
    this.showPasswordFields.update((v) => !v);

    if (!this.showPasswordFields()) {
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

    const { currentPassword, newPassword, confirmPassword } =
      this.profileForm.value;

    if (this.showPasswordFields()) {
      if (!currentPassword) {
        this.errorMessage.set(
          'Senha atual é obrigatória para alteração de senha',
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        this.errorMessage.set('As senhas não coincidem');
        return;
      }
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.loadingService.show();

    const updateData: { name?: string; email?: string; password?: string } = {};

    const nameCtrl = this.profileForm.get('name');
    const emailCtrl = this.profileForm.get('email');

    if (nameCtrl?.dirty) updateData.name = nameCtrl.value.trim();
    if (emailCtrl?.dirty) updateData.email = emailCtrl.value.trim();

    if (this.showPasswordFields() && newPassword) {
      updateData.password = newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      this.loadingService.hide();
      this.successMessage.set('Nada para atualizar.');
      return;
    }

    this.userService
      .updateProfile(updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.successMessage.set('Perfil atualizado com sucesso!');
          this.toastService.success('Perfil atualizado com sucesso!');
          this.showPasswordFields.set(false);
          this.profileForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });

          this.profileForm.markAsPristine();
          this.profileForm.markAsUntouched();
        },
        error: (error) => {
          this.loadingService.hide();
          const errorMsg = error.error?.message || 'Erro ao atualizar perfil. Tente novamente.';
          this.errorMessage.set(errorMsg);
          this.toastService.error(errorMsg);
        },
      });
  }

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    this.loadingService.show();
    this.userService
      .deleteAccount()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.authService.logout()),
      )
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.toastService.success('Conta excluída com sucesso!');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loadingService.hide();
          const errorMsg = error.error?.message || 'Erro ao excluir conta. Tente novamente.';
          this.errorMessage.set(errorMsg);
          this.toastService.error(errorMsg);
          this.closeDeleteModal();
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/reservations']);
  }

  logout(): void {
    this.loadingService.show();
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.toastService.info('Logout realizado com sucesso!');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loadingService.hide();
          const errorMsg = error.error?.message || 'Erro ao realizar o logout. Tente novamente.';
          this.errorMessage.set(errorMsg);
          this.toastService.error(errorMsg);
        },
      });
  }
}
