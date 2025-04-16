// src/app/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service'; // Убедись, что путь правильный

export const authGuard: CanActivateFn = (route, state):
  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Используем isLoggedIn$ для реактивной проверки
  return authService.isLoggedIn$.pipe(
    take(1), // Берем только текущее значение и завершаем поток
    map(isLoggedIn => {
      if (isLoggedIn) {
        // Пользователь залогинен (по мнению сервиса, т.е. токен есть локально)
        return true;
      } else {
        // Пользователь не залогинен, перенаправляем на страницу входа
        console.log('AuthGuard: Access denied, redirecting to login.');
        // Сохраняем URL, на который пользователь пытался перейти, чтобы вернуться после входа
        const returnUrl = state.url;
        return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
      }
    })
  );
};