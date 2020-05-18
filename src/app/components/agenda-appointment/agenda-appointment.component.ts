import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../interfaces/appointment';
import * as moment from 'moment';

@Component({
  selector: 'app-agenda-appointment',
  templateUrl: './agenda-appointment.component.html',
  styleUrls: ['./agenda-appointment.component.scss'],
})
export class AgendaAppointmentComponent implements OnInit {
  @Input() appointment: Appointment;
  @Input() containerHeight: number;
  @Input() dayLengthMinutes: number;
  @Input() top: number;

  height: number;
  constructor() {}

  ngOnInit() {
    if (
      this.appointment &&
      this.appointment.startDate &&
      this.appointment.endDate
    ) {
      const diff =
        moment(this.appointment.endDate).diff(
          moment(this.appointment.startDate),
          'minutes',
        );

     const percentHeight = (diff / this.dayLengthMinutes);
     this.height = percentHeight * this.containerHeight;
    }
  }
}
