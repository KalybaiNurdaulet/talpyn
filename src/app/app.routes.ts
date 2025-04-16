// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LectureComponent } from './lecture/lecture.component';
import { TestingComponent } from './testing/testing.component';
import { LectureListingComponent } from './lecture-listing/lecture-listing.component';
// import { QuizComponent } from './quiz/quiz.component'; // Если есть QuizComponent
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard'; // <-- Импортируем гард

export const routes: Routes = [
    // Защищенные маршруты
    {
        path: 'lecture',
        component: LectureComponent,
        // canActivate: [authGuard] // <-- Применяем гард
    },
    {
        path: 'testing',
        component: TestingComponent, // <-- Применяем гард
    },
    {
        path: 'lecture/lecturelisting', // Дочерний маршрут тоже можно защитить
        component: LectureListingComponent,
        canActivate: [authGuard] // <-- Применяем гард
    },
    // { path:'quiz', component: QuizComponent, canActivate: [authGuard] }, // Если есть

    // Публичные маршруты
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Маршрут по умолчанию: перенаправляем на лекции (если залогинен) или на логин (если нет)
    // Гарт на '/lecture' сам обработает редирект на логин, если нужно
    { path: '', redirectTo: '/lecture', pathMatch: 'full' },

    // Можно добавить маршрут для ненайденных страниц (404) или перенаправить на логин
    { path: '**', redirectTo: '/login' } // Перенаправляем на логин, если путь не найден
];