import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'; // Добавляем map
import { Router } from '@angular/router';

// --- Интерфейсы ---

// Ответ от /token/ (Simple JWT)
export interface TokenResponse {
  access: string;
  refresh?: string; // Опционально, если планируете использовать refresh token
}

// Данные для /token/
export interface LoginCredentials {
  username: string; // Simple JWT по умолчанию ожидает 'username'
  password: string;
}

// Данные для /register/
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string; // Добавлено поле подтверждения пароля
  first_name?: string; // Опционально
  last_name?: string;  // Опционально
}

// Ответ от /register/ (может вернуть данные пользователя или просто статус)
export interface RegistrationResponse {
    id?: number;
    username?: string;
    email?: string;
    message?: string; // Или другое поле с сообщением
    // Могут быть и другие поля из UserSerializer
}

// --- Сервис ---

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Базовый URL остается прежним
  private apiUrl = 'http://127.0.0.1:8000/api/auth';
  // Ключ для access токена
  private tokenKey = 'accessToken';
  // Можно добавить ключ для refresh токена, если нужно
  // private refreshTokenKey = 'refreshToken';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Регистрация нового пользователя (/register/)
   * @param userData Данные для регистрации (согласно интерфейсу RegisterData)
   * @returns Observable с ответом от API (согласно RegistrationResponse)
   */
  register(userData: RegisterData): Observable<RegistrationResponse> {
    // Используем правильный путь
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/register/`, userData)
      .pipe(
        tap(response => console.log('Registration successful:', response)),
        catchError(this.handleError)
      );
  }

  /**
   * Вход пользователя в систему (/token/)
   * @param credentials Учетные данные для входа (согласно LoginCredentials)
   * @returns Observable, который ЗАВЕРШАЕТСЯ после сохранения токена (void)
   *          Или Observable<TokenResponse> если хотите вернуть токены компоненту
   */
  login(credentials: LoginCredentials): Observable<void> { // Возвращаем void для простоты
    // Используем правильный путь /token/
    return this.http.post<TokenResponse>(`${this.apiUrl}/token/`, credentials)
      .pipe(
        tap(response => {
          // Сохраняем access токен
          if (response && response.access) {
            this.saveToken(response.access);
            // Опционально: сохраняем refresh токен
            // if (response.refresh) { this.saveRefreshToken(response.refresh); }
            this.loggedIn.next(true); // Обновляем статус
            console.log('Login successful, access token stored.');
          } else {
            console.warn('Login successful, but no access token received.');
            // Возможно, стоит выбросить ошибку, если токен критичен
            // throw new Error('Access token not received');
          }
        }),
        map(() => void 0), // Преобразуем результат в void после tap
        catchError(this.handleError)
      );
  }

  /**
   * Выход пользователя из системы
   */
  logout(): void {
    this.removeToken(); // Удаляем access токен
    // Опционально: удаляем refresh токен
    // this.removeRefreshToken();
    this.loggedIn.next(false);
    console.log('User logged out.');
    this.router.navigate(['/login']); // Укажите ваш путь
  }

  /**
   * Сохраняет access токен в localStorage
   * @param token Access токен
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Удаляет access токен из localStorage
   */
  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Получает access токен из localStorage
   * @returns Access токен или null
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // --- Опционально: Функции для Refresh Token ---
  /*
  private saveRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }
  private removeRefreshToken(): void {
    localStorage.removeItem(this.refreshTokenKey);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }
  */

  /**
   * Проверяет наличие access токена
   * @returns true, если токен есть, иначе false
   */
  private hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Обработчик ошибок HTTP
   * @param error Объект ошибки HttpErrorResponse
   * @returns Observable с ошибкой
   */
   private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    let errorMessage = 'Произошла неизвестная ошибка!';

    if (error.error) {
        // Пытаемся извлечь детали ошибки из DRF/SimpleJWT
        if (typeof error.error === 'object') {
            // Стандартная ошибка Simple JWT или DRF Validation Error
            if (error.error.detail) {
                errorMessage = error.error.detail;
            } else {
                // Обработка ошибок валидации DRF (словарь поле -> список ошибок)
                const fieldErrors = Object.entries(error.error)
                  .map(([field, messages]) => `${field}: ${(Array.isArray(messages) ? messages.join(', ') : messages)}`)
                  .join('\n');
                if (fieldErrors) {
                    errorMessage = `Ошибки валидации:\n${fieldErrors}`;
                } else {
                    // Если не стандартный формат, пытаемся показать как есть
                    errorMessage = JSON.stringify(error.error);
                }
            }
        } else if (typeof error.error === 'string') {
            // Иногда ошибка может быть просто строкой
             errorMessage = error.error;
        }
    } else if (error.message) {
        errorMessage = error.message;
    }

    // Добавляем статус код для контекста
    errorMessage = `Ошибка ${error.status}: ${errorMessage}`;

    // Возвращаем Observable с ошибкой
    return throwError(() => new Error(errorMessage));
  }
}