import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../interfaces/appointment';

@Component({
  selector: 'app-agenda-appointment',
  templateUrl: './agenda-appointment.component.html',
  styleUrls: ['./agenda-appointment.component.scss'],
})
export class AgendaAppointmentComponent implements OnInit {

  @Input() appointment: Appointment;
  constructor() { }

  ngOnInit() {}

}
