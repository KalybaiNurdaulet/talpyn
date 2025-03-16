import { Component, OnInit } from '@angular/core';
import { Question } from '../question';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  questions: Question[] = [
    {
      questionText:'ghbdtn',
      options:['By','Hello','Goodbay','Salam'],
      correctAnswerIndex:1,
    },
    {
      questionText:'Привет',
      options:['By','Hello','Goodbay','Salam'],
      correctAnswerIndex:1,
    },
    {
      questionText:'Привет',
      options:['By','Hello','Goodbay','Salam'],
      correctAnswerIndex:1,
    }
  ]

  currentQuestionIndex: number = 0;
  selectedAnswerIndex: number| null = null;
  correctAnswersCount: number = 0;
  quizCompleted: boolean = false;

  constructor(){

  }

  ngOnInit(): void{

  }

  selectAnswer(answerIndex:number):void{
    this.selectedAnswerIndex = answerIndex;
  }

  nextQuestion():void{
    if(this.selectedAnswerIndex == null){
      alert("Пж выбери ответ");
      return;
    }

    if(this.selectedAnswerIndex == this.questions[this.currentQuestionIndex].correctAnswerIndex){
      this.correctAnswersCount++;
    }

    this.selectedAnswerIndex = null;
    this.currentQuestionIndex++;

    if(this.currentQuestionIndex == this.questions.length){
      this.quizCompleted = true;
    }

    
  }

  resetQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswerIndex = null;
    this.correctAnswersCount = 0;
    this.quizCompleted = false;
  }
}
