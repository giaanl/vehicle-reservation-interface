import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthContainerComponent } from '../shared/auth-container/auth-container.component';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthContainerComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);

  registerForm: FormGroup;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  private passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loadingService.show();
    this.errorMessage = '';

    const { confirmPassword, ...registerData } = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: () => {
        this.loadingService.hide();
        this.toastService.success('Conta criada com sucesso!', 'Bem-vindo');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loadingService.hide();
        const errorMsg = error.error?.message || 'Erro ao criar conta. Tente novamente.';
        this.errorMessage = errorMsg;
        this.toastService.error(errorMsg);
      },
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (field?.hasError('email')) {
      return 'Email inválido';
    }

    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }

    if (
      fieldName === 'confirmPassword' &&
      this.registerForm.hasError('passwordMismatch')
    ) {
      return 'As senhas não coincidem';
    }

    return '';
  }
}
