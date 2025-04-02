// src/app/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms'; // Импортируем нужные классы
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService,RegisterData } from '../services/auth.service'; // Используем обновленный сервис

// --- Кастомный валидатор совпадения паролей ---
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const password2 = control.get('password2');

  // Если одно из полей еще не тронуто, не показываем ошибку
  if (!password || !password2 || !password.value || !password2.value) {
      return null;
  }

  // Устанавливаем ошибку на поле password2, если они не совпадают
  if (password.value !== password2.value) {
    password2.setErrors({ ...password2.errors, passwordMismatch: true }); // Добавляем ошибку
    return { passwordMismatch: true }; // Возвращаем ошибку для формы
  } else {
    // Если совпадают, убираем конкретно эту ошибку с поля password2
    const errors = { ...password2.errors };
    delete errors['passwordMismatch'];
     // Если других ошибок нет, очищаем ошибки поля полностью
    if (Object.keys(errors).length === 0) {
        password2.setErrors(null);
    } else {
         password2.setErrors(errors);
    }
    return null; // Нет ошибки на уровне формы
  }
};


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Валидаторы по желанию
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]], // Например, минимум 8 символов
      password2: ['', [Validators.required]],
      first_name: [''], // Опционально
      last_name: ['']   // Опционально
    }, { validators: passwordMatchValidator }); // Применяем валидатор ко всей группе
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.errorMessage = null;
    this.registerForm.markAllAsTouched(); // Показать все ошибки перед отправкой

    if (this.registerForm.invalid) {
      console.log("Form invalid:", this.registerForm.errors); // Лог ошибок формы
      // Проверка конкретной ошибки валидатора пароля на password2
      const password2Control = this.registerForm.get('password2');
       if (password2Control?.errors?.['passwordMismatch']) {
          console.log("Passwords do not match!");
       }
      return;
    }

    this.isLoading = true;
    // Собираем данные, исключая password2 (сериализатор ожидает его, но не для создания User)
    // Хотя наш сериализатор его обрабатывает, так что отправляем все
    const userData: RegisterData = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration Response:', response);
        alert('Регистрация прошла успешно! Теперь вы можете войти.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        // Используем сообщение из кастомного обработчика ошибок
        this.errorMessage = err.message || 'Ошибка регистрации.';
        console.error('Registration failed:', err);
      }
    });
  }

  // Геттеры для удобного доступа к контролам в шаблоне (опционально)
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get password2() { return this.registerForm.get('password2'); }
}