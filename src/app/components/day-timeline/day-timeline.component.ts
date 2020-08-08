import { Component, Input, OnInit } from '@angular/core';
import { Duration, Moment } from 'moment';
import { Observable } from 'rxjs';
import { Appointment } from '../../interfaces/appointment';
import { AppointmentsService } from '../../services/appointments.service';

interface TimeBlock {
  start: Date;
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
  @Input() padding: number = 16;

  timeBlocks: TimeBlock[] = [];
  dayLengthMinutes: number;
  componentHeight: number = 1900;

  constructor(private appointmentsService: AppointmentsService) {
    // Map creado una lista de interfaz Appoinment propia
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
