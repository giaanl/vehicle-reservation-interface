import {
  Component,
  inject,
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
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthContainerComponent } from '../shared/auth-container/auth-container.component';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthContainerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  loginForm: FormGroup;
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loadingService.show();
    this.errorMessage.set('');

    this.authService
      .login(this.loginForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.router.navigate(['/reservations']);
        },
        error: (error) => {
          this.loadingService.hide();
          const errorMsg = error.error?.message || 'Erro ao fazer login. Verifique suas credenciais.';
          this.errorMessage.set(errorMsg);
          this.toastService.error(errorMsg);
        },
      });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (field?.hasError('email')) {
      return 'Email inválido';
    }

    return '';
  }
}
