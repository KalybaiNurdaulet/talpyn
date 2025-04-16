// src/app/components/chat/chat.component.ts
import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { FormsModule } from '@angular/forms'; // Импорт для [(ngModel)]
import { CommonModule } from '@angular/common'; // Импорт для *ngFor, *ngIf

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-chat',
  standalone: true, // Если используете standalone компоненты
  imports: [CommonModule, FormsModule], // Импортируем необходимые модули
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private chatService: ChatService) {}

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return; // Не отправлять пустые сообщения
    }

    const userMessage: ChatMessage = { sender: 'user', text: this.newMessage };
    this.messages.push(userMessage);

    const messageToSend = this.newMessage;
    this.newMessage = ''; // Очищаем поле ввода
    this.isLoading = true;
    this.error = null;

    // TODO: Передавать историю чата (this.messages) в сервис, если бэкенд ее поддерживает
    this.chatService.sendMessage(messageToSend).subscribe({
      next: (response) => {
        if (response.reply) {
          const aiMessage: ChatMessage = { sender: 'ai', text: response.reply };
          this.messages.push(aiMessage);
        } else if (response.error) {
          // Отображаем ошибку, полученную от бэкенда
          this.error = `Ошибка от сервера: ${response.error}`;
          // Можно добавить временное сообщение об ошибке в чат
          this.messages.push({sender: 'ai', text: `Произошла ошибка: ${response.error}`});
        }
        this.isLoading = false;
        this.scrollToBottom(); // Прокрутка вниз
      },
      error: (err) => {
        console.error('Ошибка в компоненте чата:', err);
        this.error = err.message || 'Не удалось отправить сообщение.';
         // Добавляем сообщение об ошибке в чат
        this.messages.push({ sender: 'ai', text: `Ошибка связи: ${this.error}` });
        this.isLoading = false;
        this.scrollToBottom(); // Прокрутка вниз
      }
    });
  }

  // Простая прокрутка к последнему сообщению
  scrollToBottom(): void {
     setTimeout(() => {
       const chatContainer = document.querySelector('.chat-messages'); // Используйте подходящий селектор
       if (chatContainer) {
         chatContainer.scrollTop = chatContainer.scrollHeight;
       }
     }, 0);
  }
}