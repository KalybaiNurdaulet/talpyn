import { Component } from '@angular/core';
import { QuizComponent } from '../quiz/quiz.component';

@Component({
  selector: 'app-testing',
  imports: [QuizComponent],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent {

}
