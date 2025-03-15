import { Component, Input } from '@angular/core';
import { LectureListing } from '../lecture-listing';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lecture-listing',
  imports: [CommonModule],
  templateUrl: './lecture-listing.component.html',
  styleUrl: './lecture-listing.component.css'
})
export class LectureListingComponent {
  items: LectureListing[] = [
    { title: 'Лекция 1: Введение', content: 'Описание лекции 1', isOpen: false, link:'https://www.youtube.com/embed/t3BZgs30QJY' },
    { title: 'Лекция 2: Основные концепции', content: 'Описание лекции 2', isOpen: false , link:'https://www.youtube.com/embed/UwD5kMg1oCU?si=7WtaGWAopf3-iIoF' },
    { title: 'Лекция 3: Практическое применение', content: 'Описание лекции 3', isOpen: false , link:'https://www.youtube.com/embed/YRXFUzzUYnw?si=vEKHFmjFkbQ7k4DC' }
  ];
;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.items.forEach(item => item.isOpen = false);
  }

  toggleItem(item: LectureListing): void {
    item.isOpen = !item.isOpen;
  }
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
