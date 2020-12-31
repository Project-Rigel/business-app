import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import moment, { Moment } from 'moment';
import { Interval } from '../../interfaces/interval';

@Component({
  selector: 'app-agenda-intervals',
  templateUrl: './agenda-intervals.component.html',
  styleUrls: ['./agenda-intervals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaIntervalsComponent implements OnInit {
  @Input() startDate: Moment;
  @Input() dayLengthMinutes: number;
  @Input() parentContainerLengthPx: number;
  @Input() parentPadding: number;
  @Input() interval: Interval;

  heightPx: number;
  topPx: number;

  ngOnInit() {
    this.computeHeightAttribute();
    this.computeTopProperty();
  }

  private computeHeightAttribute() {
    const minuteDiff = moment
      .utc(this.interval.endHour, 'HH:mm')
      .diff(moment.utc(this.interval.startHour, 'HH:mm'), 'minutes');

    const percentOfDayDuration = minuteDiff / this.dayLengthMinutes;
    this.heightPx = percentOfDayDuration * this.parentContainerLengthPx;
  }

  private computeTopProperty() {
    const date = this.startDate.toDate();
    date.setDate(15);
    date.setFullYear(2020);
    date.setMonth(5);

    const startDateString = date.toDateString();
    const startHour = moment.utc(
      startDateString + ' ' + this.interval.startHour,
    );

    const diffFromStartOfDay = moment(startHour)
      .local()
      .diff(moment(date), 'minutes');
    const percentOfTotalDayDuration =
      diffFromStartOfDay / this.dayLengthMinutes;
    this.topPx =
      percentOfTotalDayDuration * this.parentContainerLengthPx +
      this.parentPadding;
  }
}
