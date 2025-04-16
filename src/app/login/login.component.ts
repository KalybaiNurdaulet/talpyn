
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService,LoginCredentials } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      // Simple JWT по умолчанию использует 'username'
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Редирект, если уже вошел
    if (this.authService.getToken()) {
       // this.router.navigate(['/dashboard']); // Укажите ваш путь
       console.log('User already logged in, redirecting...');
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const credentials: LoginCredentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      // next теперь не получает данных, т.к. сервис возвращает Observable<void>
      next: () => {
        this.isLoading = false;
        console.log('Login successful, navigating...');
        // Редирект на защищенную страницу
        this.router.navigate(['./lecture']);
      },
      error: (err) => {
        this.isLoading = false;
         // Используем сообщение из кастомного обработчика ошибок
        this.errorMessage = err.message || 'Ошибка входа.';
        // Simple JWT часто возвращает 401 с {"detail": "..."} при неверных данных
        if (err.message?.includes('401')) {
             this.errorMessage = 'Неверное имя пользователя или пароль.';
        }
        console.error('Login failed:', err);
      }
    });
  }

   // Геттеры для шаблона
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}