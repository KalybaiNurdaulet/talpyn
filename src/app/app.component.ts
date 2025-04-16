import { Component,inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterOutlet, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'talpyn';
  imageLogo = 'assets/images/5656.png';

  authService = inject(AuthService);

  // Метод, который вызывается при клике на кнопку "Выйти"
  logout(): void {
    this.authService.logout(); // Вызываем метод logout из сервиса
    // Сервис сам удалит токен, обновит isLoggedIn$ и перенаправит на /login
    console.log('Logout button clicked, calling authService.logout()');
  }
}
