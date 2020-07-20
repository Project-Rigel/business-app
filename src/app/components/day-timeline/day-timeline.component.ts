import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../interfaces/appointment';
import { Duration, Moment } from 'moment';
import { AppointmentsService } from '../../services/appointments.service';
import { Observable } from 'rxjs';

interface TimeBlock {
  start: Date,
}

@Component({
  selector: 'app-day-timeline',
  templateUrl: './day-timeline.component.html',
  styleUrls: ['./day-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayTimelineComponent implements OnInit {

  @Input() appointments: Observable<Appointment[]>;
  @Input() startDate: Moment;
  @Input() endDate: Moment;
  @Input() intervalsLength: Duration;
  @Input() padding: number = 16;

  timeBlocks: TimeBlock[] = [];
  dayLengthMinutes: number;
  componentHeight: number = 1200;

  constructor(private appointmentsService: AppointmentsService) {
  }

  ngOnInit() {
    this.dayLengthMinutes = this.endDate.diff(this.startDate, 'minutes');
    const nBlocks = Math.floor(this.dayLengthMinutes / this.intervalsLength.asMinutes());

    this.timeBlocks = this.appointmentsService.getAllPossibleAppointments().map(v => {
      return { start: v };
    });
  }

}
