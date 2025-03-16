export interface Question {
    questionText: string;
    options: string[]; // Массив из 4 вариантов ответа
    correctAnswerIndex: number; // Индекс правильного ответа в массиве options (0-3)
  }