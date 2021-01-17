import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DayOfWeekTranslatorService {
  englishDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  spanishDays = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  public translateDayInto(day: string, lang: 'ES' | 'EN' = 'ES'): string {
    if (lang === 'ES') {
      const dayIndex = this.englishDays.indexOf(day);
      return this.spanishDays[dayIndex];
    } else {
      const dayIndex = this.spanishDays.indexOf(day);
      return this.englishDays[dayIndex];
    }
  }
}
