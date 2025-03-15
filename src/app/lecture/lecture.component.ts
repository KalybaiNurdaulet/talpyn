import { Component } from '@angular/core';
import { Lecture } from '../lecture';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-lecture',
  imports: [CommonModule,RouterOutlet],
  templateUrl: './lecture.component.html',
  styleUrl: './lecture.component.css'
})
export class LectureComponent {
  lectures: Lecture[] = [
    {
      id:0,
      name: 'Matematika',
      description: 'Very helpful',
      price:1000,
      photo:'https://avatars.mds.yandex.net/i?id=3828b076659d3333a5d677b14bfccf713fb1ee4e-11912249-images-thumbs&n=13',
    },
    {
      id:2,
      name: 'Тригонометрия',
      description: 'Very helpful',
      price:2000,
      photo:'https://avatars.mds.yandex.net/i?id=3828b076659d3333a5d677b14bfccf713fb1ee4e-11912249-images-thumbs&n=13',
    }
  ]
}
