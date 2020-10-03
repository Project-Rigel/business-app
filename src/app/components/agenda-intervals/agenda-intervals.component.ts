import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Interval } from '../../interfaces/interval';

@Component({
  selector: 'app-agenda-intervals',
  templateUrl: './agenda-intervals.component.html',
  styleUrls: ['./agenda-intervals.component.scss'],
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
    console.log(this.interval);
  }

  private computeHeightAttribute() {
    const minuteDiff = moment(this.interval.endHour, 'HH:mm').diff(
      moment(this.interval.startHour, 'HH:mm'),
      'minutes',
    );

    const percentOfDayDuration = minuteDiff / this.dayLengthMinutes;
    this.heightPx = percentOfDayDuration * this.parentContainerLengthPx - 1; // -1 para separar visualmente citas adyacentes verticalemnte
  }

  private computeTopProperty() {
    const diffFromStartOfDay = moment(this.interval.startHour, 'HH:mm').diff(
      this.startDate,
      'minutes',
    );
    const percentOfTotalDayDuration =
      diffFromStartOfDay / this.dayLengthMinutes;
    this.topPx =
      percentOfTotalDayDuration * this.parentContainerLengthPx +
      this.parentPadding;
  }
}
