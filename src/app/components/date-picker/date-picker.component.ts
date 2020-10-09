import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Calendar, Day } from 'dayspan';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Config } from '../../services/set-agenda-config-bulk.service';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @Input() monthLabels = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  @Input() dayLabels = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  @Input() date: Date;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() validDates: Date[] = [];
  @Input() dateStyles: any = {};

  @Input() backgroundStyle = { 'background-color': '#ffffff' };
  @Input() notInCalendarStyle = { color: '#8b8b8b' };
  @Input() dayLabelsStyle = {
    'font-weight': 300,
    'font-size': '14px',
    color: 'var(--ion-color-light-shade)',
  };
  @Input() monthLabelsStyle = { 'font-size': '15px' };
  @Input() yearLabelsStyle = { 'font-size': '15px' };
  @Input() itemSelectedStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  @Input() invalidDateStyle = {
    'text-decoration': 'line-through',
    color: 'red',
  };
  @Input() todaysItemStyle = {
    color: 'var(--ion-color-primary)',
  };

  @Input() todaySelectedStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffffff',
  };

  @Input() freeDayStyle = {
    backgroundColor: 'lightgreen',
  };

  @Input() freeDaySelectedStyle = {
    backgroundColor: 'var(--ion-color-primary)',
  };

  @Input() insideitemSelectedStyle = {
    backgroundColor: 'var(--ion-color-primary)',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  @Input() insideTodaySelectedStyle = {
    backgroundColor: 'var(--ion-color-primary)',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  //@Input() agendaConfig: Observable<GetAgendaConfigResponse>;
  @Input() agendaConfig: Observable<any>;
  @Output() onSelect: EventEmitter<Date> = new EventEmitter();

  showView = 'calendar';
  weeks: Array<Array<Day>>;
  years: Array<number>;

  yearSelected = new Date().getFullYear();
  monthSelected = new Date().getMonth() + 1;

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  currentDay = new Date().getDate();

  daySelected: Day;
  dayHighlighted: Day;

  startYear: number;
  endYear: number;
  agendaConfigurations: Config[];

  async ngOnInit() {
    this.initOptions();
    this.createCalendarWeeks();
    await this.agendaConfig.subscribe(configs => {
      this.agendaConfigurations = configs;
    });
  }

  initOptions() {
    if (this.date && this.fromDate && this.date < this.fromDate) {
      throw new Error(
        'Invalid date input. date must be same or greater than fromDate',
      );
    }

    if (this.date && this.toDate && this.toDate < this.date) {
      throw new Error(
        'Invalid date input. date must be same or lesser than toDate',
      );
    }

    if (this.toDate && this.fromDate && this.fromDate > this.toDate) {
      throw new Error(
        'Invalid date input. from date must be lesser than or equal to toDate',
      );
    }

    this.yearSelected = this.date
      ? this.date.getFullYear()
      : this.toDate
      ? this.toDate.getFullYear()
      : new Date().getFullYear();
    this.monthSelected = this.date
      ? this.date.getMonth() + 1
      : this.toDate
      ? this.toDate.getMonth() + 1
      : new Date().getMonth() + 1;
    this.dayHighlighted = this.date
      ? Day.fromDate(this.date)
      : this.toDate
      ? Day.fromDate(this.toDate)
      : Day.today();

    if (this.date) {
      this.daySelected = this.dayHighlighted;
    }
  }

  createCalendarWeeks() {
    this.weeks = this.generateCalendarWeeks(
      Day.fromDate(
        moment(
          this.monthSelected + '-01-' + this.yearSelected,
          'MM-DD-YYYY',
        ).toDate(),
      ),
    );
  }

  hasPrevious(): boolean {
    if (!this.fromDate) {
      return true;
    }

    let previousMonth;
    let previousYear;
    if (this.monthSelected === 1) {
      previousMonth = 11;
      previousYear = this.yearSelected - 1;
    } else {
      previousMonth = this.monthSelected;
      previousYear = this.yearSelected;
    }

    // The last day of previous month should be greatar than or equal to fromDate
    return new Date(previousYear, previousMonth, 0) >= this.fromDate;
  }

  hasNext(): boolean {
    if (!this.toDate) {
      return true;
    }

    let nextMonth;
    let nextYear;
    if (this.monthSelected === 12) {
      nextMonth = 0;
      nextYear = this.yearSelected + 1;
    } else {
      nextMonth = this.monthSelected;
      nextYear = this.yearSelected;
    }

    // The first day of next month should be less than or equal to toDate
    return new Date(nextYear, nextMonth, 1) <= this.toDate;
  }

  previous() {
    if (this.monthSelected === 1) {
      this.monthSelected = 12;
      this.yearSelected--;
    } else {
      this.monthSelected--;
    }

    this.createCalendarWeeks();
  }

  next() {
    if (this.monthSelected === 12) {
      this.monthSelected = 1;
      this.yearSelected++;
    } else {
      this.monthSelected++;
    }

    this.createCalendarWeeks();
  }

  confirmDay(day: Day) {
    this.onSelect.emit(day.toDate());
  }

  selectDay(day: Day) {
    if (!this.isValidDay(day) || !this.isOneOfTheValidDates(day)) {
      return;
    }

    this.daySelected = day;
    setTimeout(() => {
      this.confirmDay(day);
    }, 200);
  }

  showMonthView() {
    this.showView = 'month';
    ``;
  }

  hasYearSelection() {
    if (!this.toDate || !this.fromDate) {
      return true;
    }

    return this.toDate.getFullYear() !== this.fromDate.getFullYear();
  }

  showYearView() {
    this.showView = 'year';
    let startYear = this.yearSelected - 10;
    if (startYear % 10 !== 0) {
      startYear = startYear - (startYear % 10);
    }
    const endYear = startYear + 19;

    this.startYear = startYear;
    this.endYear = endYear;

    this.generateYears();
  }

  generateYears() {
    if (this.fromDate && this.startYear < this.fromDate.getFullYear()) {
      this.startYear = this.fromDate.getFullYear();
    }

    if (this.toDate && this.endYear > this.toDate.getFullYear()) {
      this.endYear = this.toDate.getFullYear();
    }

    this.years = [];
    for (let i = this.startYear; i <= this.endYear; i++) {
      this.years.push(i);
    }
  }

  showPreviousYears() {
    this.endYear = this.startYear - 1;
    this.startYear = this.endYear - 19;
    this.generateYears();
  }

  showNextYears() {
    this.startYear = this.endYear + 1;
    this.endYear = this.startYear + 19;
    this.generateYears();
  }

  hasPreviousYears() {
    if (!this.fromDate) {
      return true;
    }

    return this.startYear > this.fromDate.getFullYear();
  }

  hasNextYears() {
    if (!this.toDate) {
      return true;
    }

    return this.endYear < this.toDate.getFullYear();
  }

  selectMonth(month: number) {
    if (!this.isValidMonth(month - 1)) {
      return;
    }

    this.monthSelected = month;
    this.createCalendarWeeks();
    setTimeout(() => {
      this.showView = 'calendar';
    }, 200);
  }

  selectYear(year) {
    this.yearSelected = year;
    this.createCalendarWeeks();
    setTimeout(() => {
      this.showView = 'calendar';
    }, 200);
  }

  resetView() {
    this.showView = 'calendar';
  }

  isToday(day) {
    return (
      this.yearSelected === this.currentYear &&
      this.monthSelected === this.currentMonth &&
      day === this.currentDay
    );
  }

  generateCalendarWeeks(forDay: Day): Array<any> {
    const weeks: Array<any> = [];
    const month = Calendar.months<string, any>(1, forDay);
    const numOfWeeks = month.days.length / 7;

    let dayIndex = 0;
    for (let week = 0; week < numOfWeeks; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        days.push(month.days[dayIndex]);
        dayIndex++;
      }
      weeks.push(days);
    }
    return weeks;
  }

  isValidDay(day: Day) {
    if (!this.toDate && !this.fromDate) {
      return true;
    }

    if (this.toDate && this.fromDate) {
      return day.toDate() >= this.fromDate && day.toDate() <= this.toDate;
    }

    if (this.toDate) {
      return day.toDate() <= this.toDate;
    }

    if (this.fromDate) {
      return day.toDate() >= this.fromDate;
    }
  }

  isOneOfTheValidDates(day: Day) {
    if (this.validDates && this.validDates.length) {
      const index = this.validDates.findIndex(
        validDate =>
          validDate.getFullYear() === day.toDate().getFullYear() &&
          validDate.getMonth() === day.toDate().getMonth() &&
          validDate.getDate() === day.toDate().getDate(),
      );
      return index !== -1;
    }

    return true;
  }

  isValidMonth(index: number) {
    if (
      this.toDate &&
      this.toDate.getFullYear() !== this.yearSelected &&
      this.fromDate &&
      this.fromDate.getFullYear() !== this.yearSelected
    ) {
      return true;
    }

    if (!this.toDate && !this.fromDate) {
      return true;
    }

    if (this.fromDate && !this.toDate) {
      return new Date(this.yearSelected, index, 1) >= this.fromDate;
    }

    if (this.toDate && !this.fromDate) {
      return new Date(this.yearSelected, index, 1) <= this.toDate;
    }

    return (
      new Date(this.yearSelected, index, 1) >= this.fromDate &&
      new Date(this.yearSelected, index, 1) <= this.toDate
    );
  }

  getMonthName() {
    return this.monthLabels[this.monthSelected - 1];
  }

  //Styles

  getDayStyle(day: Day) {
    let style = {};
    if (this.isToday(day.dayOfMonth)) {
      style = this.todaysItemStyle;
    }

    if (
      this.daySelected &&
      day.dayIdentifier === this.daySelected.dayIdentifier
    ) {
      if (this.isToday(this.daySelected.dayOfMonth)) {
        style = { ...style, ...this.todaySelectedStyle };
      } else {
        style = { ...style, ...this.itemSelectedStyle };
      }
    }

    const dayStyle =
      this.dateStyles &&
      this.dateStyles[
        day
          .toDate()
          .toISOString()
          .slice(0, 10)
      ];
    if (dayStyle) {
      style = { ...style, ...dayStyle };
    }

    return style;
  }

  getDaySelectedStyle(day: Day) {
    let style = {};
    if (
      this.daySelected &&
      day.dayIdentifier === this.daySelected.dayIdentifier
    ) {
      if (this.isToday(this.daySelected.dayOfMonth)) {
        style = { ...style, ...this.insideTodaySelectedStyle };
      } else {
        if (this.agendaConfigurations) {
          let found = false;
          for (let i = 0; i < this.agendaConfigurations.length; i++) {
            if (
              this.isAWeeklyConfigurationDay(
                this.agendaConfigurations[i],
                day,
              ) ||
              this.isASpecificConfigurationDay(
                this.agendaConfigurations[i],
                day,
              )
            ) {
              style = { ...style, ...this.freeDaySelectedStyle };
              found = true;
              break;
            }
          }
          if (!found) {
            style = { ...style, ...this.insideitemSelectedStyle };
          }
        }
      }
    }
    style = { ...style, ...this.getDayConfigStyle(day) };

    return style;
  }

  getDayConfigStyle(day: Day) {
    let style = {};
    if (this.agendaConfigurations)
      for (let i = 0; i < this.agendaConfigurations.length; i++) {
        if (
          this.isAWeeklyConfigurationDay(this.agendaConfigurations[i], day) ||
          this.isASpecificConfigurationDay(this.agendaConfigurations[i], day)
        ) {
          if (
            !this.daySelected ||
            day.dayIdentifier !== this.daySelected.dayIdentifier
          ) {
            style = { ...style, ...this.freeDayStyle };
            break;
          }
        }
      }
    return style;
  }

  getMonthStyle(index) {
    let style = {};
    style = { ...style, ...this.monthLabelsStyle };
    if (index === this.currentMonth - 1) {
      style = { ...style, ...this.todaysItemStyle };
    }

    if (index === this.monthSelected - 1) {
      style = { ...style, ...this.itemSelectedStyle };
    }

    return style;
  }

  getYearStyle(year) {
    let style = {};
    style = { ...style, ...this.yearLabelsStyle };
    if (year === this.currentYear) {
      style = { ...style, ...this.todaysItemStyle };
    }

    if (year === this.yearSelected) {
      style = { ...style, ...this.itemSelectedStyle };
    }

    return style;
  }
  //End of styles

  isAWeeklyConfigurationDay(config: Config, day: Day) {
    if (config.dayOfWeek) {
      if (
        parseInt(config.dayOfWeek, 10) === day.day &&
        moment
          .utc(config.expirationDate)
          .toDate()
          .getTime() > day.toDate().getTime()
      ) {
        return true;
      }
    }
    return false;
  }

  isASpecificConfigurationDay(config: Config, day: Day) {
    if (config.specificDate) {
      const specificDate = moment.utc(config.specificDate).toDate();
      const dayDate = day.utc().toDate();
      if (
        specificDate.getDate() === dayDate.getDate() &&
        specificDate.getMonth() === dayDate.getMonth() &&
        specificDate.getFullYear() === dayDate.getFullYear()
      ) {
        return true;
      }
    }
    return false;
  }
}
