import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Appointment } from '../../interfaces/appointment';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-agenda-appointment',
  templateUrl: './timeline-appointment.component.html',
  styleUrls: ['./timeline-appointment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TimelineAppointmentComponent implements OnInit {
  @Input() dayStartDate: Moment;
  @Input() appointment: Appointment;
  @Input() dayLengthMinutes: number;
  @Input() parentContainerLengthPx: number;
  @Input() parentPadding: number;

  heightPx: number;
  topPx: number;

  constructor() {}

  ngOnInit() {
    this.computeHeightAttribute();
    this.computeTopProperty();
  }

  private computeHeightAttribute() {
    const minuteDiff = moment(this.appointment.endDate).diff(
      moment(this.appointment.startDate),
      'minutes',
    );

    const percentOfDayDuration = minuteDiff / this.dayLengthMinutes;
    this.heightPx = percentOfDayDuration * this.parentContainerLengthPx - 1; // -1 para separar visualmente citas adyacentes verticalemnte
  }

  private computeTopProperty() {
    const diffFromStartOfDay = moment(this.appointment.startDate).diff(
      this.dayStartDate,
      'minutes',
    );
    const percentOfTotalDayDuration =
      diffFromStartOfDay / this.dayLengthMinutes;
    this.topPx =
      percentOfTotalDayDuration * this.parentContainerLengthPx +
      this.parentPadding;
  }
}
