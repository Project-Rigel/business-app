import { Component, Input, OnInit } from '@angular/core';
import { Duration, Moment } from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../../interfaces/appointment';
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

  timeBlocks: TimeBlock[] = [];
  dayLengthMinutes: number;
  componentHeight = 1900;

  appointmentBlocks: BehaviorSubject<AppointmentBlock[]> = new BehaviorSubject<
    AppointmentBlock[]
  >([]);

  constructor(private appointmentsService: AppointmentsService) {}

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

    /* this.appointments.subscribe(appointments => {
      const appointmentBlockArray: AppointmentBlock[] = [];
      appointments.map(appointment => {
        // mirar si coinciden
        appointmentBlockArray.push({
          startDate: appointment.startDate,
          endDate: appointment.endDate,
          name: appointment.name,
          customerName: appointment.customerName,
          sharesStartTimeWithOtherAppointment: true,
          positionSharing: 1,
        });
      });
      this.appointmentBlocks.next(appointmentBlockArray);
    }); */
  }
}
