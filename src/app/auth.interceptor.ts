// src/app/auth.interceptor.ts
import { Injectable, inject } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpInterceptorFn, HttpHandlerFn
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service'; // Убедись, что путь правильный

// Используем функциональный интерсептор (рекомендуется в новых версиях Angular)
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> => {

    const authService = inject(AuthService);
    const token = authService.getToken(); // Получаем токен из сервиса

    // Клонируем запрос и добавляем заголовок Authorization, если токен есть
    if (token) {
      // Убедись, что URL запроса относится к твоему API, чтобы не отправлять токен на чужие серверы
      // (Можно добавить проверку if (req.url.startsWith(authService.apiUrlBase)))
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Стандартный формат для JWT
        }
      });
      console.log('AuthInterceptor: Added Bearer token to request for', req.url);
      return next(clonedReq); // Передаем клонированный запрос дальше
    } else {
      // Если токена нет, передаем оригинальный запрос
      return next(req);
    }
};