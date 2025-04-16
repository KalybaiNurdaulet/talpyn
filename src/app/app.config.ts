// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// Импортируем нужные функции и сам интерсептор
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor'; // <-- Импортируем интерсептор

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Стандартная настройка
    provideRouter(routes),

    // Настраиваем HttpClient с использованием нашего интерсептора
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: 'csrftoken',
        headerName: 'X-CSRFToken'
      }),
      withFetch()
      // <-- Регистрируем функциональный интерсептор
      // Если бы интерсептор был классом, использовали бы withInterceptorsFromDi() и добавили бы класс в providers ниже
    ),

    // Если бы AuthInterceptor был классом, его нужно было бы добавить сюда:
    // AuthInterceptor // <-- Регистрация классового интерсептора (не нужно для функционального)

    // ReactiveFormsModule не нужно регистрировать здесь в standalone компонентах,
    // оно импортируется напрямую в компонентах, где используется (как у тебя в LoginComponent)
  ]
};