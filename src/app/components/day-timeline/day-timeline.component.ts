import { Component, Input, OnInit } from '@angular/core';
import { Duration, Moment } from 'moment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AgendaDetailsPage } from '../../agenda/agenda-details/agenda-details.page';
import { Appointment } from '../../interfaces/appointment';
import { Interval } from '../../interfaces/interval';
import { AppointmentsService } from '../../services/appointments.service';

interface TimeBlock {
  start: Date;
}

interface AppointmentBlock {
  startDate: Date;
  endDate: Date;
  name: string;
  customerName: string;
  sharesStartTimeWithOtherAppointment: boolean;
  positionSharing: number;
}

@Component({
  selector: 'app-day-timeline',
  templateUrl: './day-timeline.component.html',
  styleUrls: ['./day-timeline.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTimelineComponent implements OnInit {
  @Input() appointments: Observable<Appointment[]>;
  @Input() startDate: Moment;
  @Input() endDate: Moment;
  @Input() intervalsLength: Duration;
  @Input() padding = 16;

  intervals: Observable<Interval[]>;

  timeBlocks: TimeBlock[] = [];
  dayLengthMinutes: number;
  componentHeight = 1900;

  appointmentBlocks: BehaviorSubject<AppointmentBlock[]> = new BehaviorSubject<
    AppointmentBlock[]
  >([]);

  constructor(
    private appointmentsService: AppointmentsService,
    agenda: AgendaDetailsPage,
  ) {
    agenda.intervals.subscribe(data => {
      this.intervals = of(data);
    });
  }

  ngOnInit() {
    this.dayLengthMinutes = this.endDate.diff(this.startDate, 'minutes');
    const nBlocks = Math.floor(
      this.dayLengthMinutes / this.intervalsLength.asMinutes(),
    );
    this.timeBlocks = this.appointmentsService
      .getAllPossibleAppointments()
      .map(v => {
        return { start: v };
      });
  }
}
