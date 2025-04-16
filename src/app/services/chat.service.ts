// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Определим интерфейс для ответа от бэкенда
interface ChatResponse {
  reply?: string; // Ответ AI
  error?: string; // Ошибка от бэкенда
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Укажите URL вашего Django API
  private apiUrl = 'http://127.0.0.1:8000/api/ask-ai/'; // Замените на ваш реальный URL

  constructor(private http: HttpClient) { }

  sendMessage(prompt: string): Observable<any> { // Замените any на ваш тип ответа
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { prompt: prompt };
    const options = {
      headers: headers,
      withCredentials: true // <--- Добавить эту опцию
    };
  
    return this.http.post<any>(this.apiUrl, body, options) // Замените any
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Ошибка при отправке сообщения:', error);
    let errorMessage = 'Произошла неизвестная ошибка';
    if (error.error instanceof ErrorEvent) {
      // Клиентская ошибка
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      // Серверная ошибка
      // Попытаемся извлечь сообщение об ошибке от Django
      errorMessage = error.error?.error || `Сервер вернул код ${error.status}: ${error.message}`;
    }
    // Возвращаем ошибку как наблюдаемый объект, чтобы компонент мог ее обработать
    return throwError(() => new Error(errorMessage));
  }
}