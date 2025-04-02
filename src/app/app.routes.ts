import { Routes } from '@angular/router';
import { LectureComponent } from './lecture/lecture.component';
import { TestingComponent } from './testing/testing.component';
import { LectureListingComponent } from './lecture-listing/lecture-listing.component';
import { QuizComponent } from './quiz/quiz.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    {path:'lecture',component:LectureComponent},
    {path:'testing',component:TestingComponent},
    {path:'lecture/lecturelisting',component:LectureListingComponent},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent}
];
