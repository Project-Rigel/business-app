import { Injectable } from '@angular/core';
import { Appointment } from '../interfaces/appointment';
import * as moment from "moment";

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  appointmentInterval = 30;
  //de 0 a 23 horas
  startHour = 9;
  endHour = 18;
  constructor() {}

  getAllPossibleAppointments(){
    const total = [];
    const nAppointments: number = Math.trunc(
      ((18-9) * 60 ) / this.appointmentInterval,
    );
    const date = new Date();
    date.setHours(this.startHour,0,0);

    for (let i = 0; i < nAppointments; i++) {
      total.push(moment(date).add(this.appointmentInterval * i, "m").toDate() );
    }

    return total;
  }
  getDayAppointments(day = new Date()) {
    const appointments: Appointment[] = [];
    const nAppointments: number = Math.trunc(
      ((18-9) * 60 ) / this.appointmentInterval,
    );
    const date = new Date();
    date.setHours(this.startHour,0,0);
    console.log(moment(date).add(this.appointmentInterval, "m").toDate());
    let startDate = null;
    let endDate = date;
    for (let i = 0; i < 8; i++) {
      if(startDate === null){
        startDate = moment(date).add(this.appointmentInterval * (i), "m").toDate();
      }else{
        startDate = endDate;
      }
      endDate = moment(startDate).add(this.appointmentInterval * 2, "m").toDate();

      const diff = moment(startDate).diff(moment(endDate),"m");
      console.log(diff);

      appointments.push({
        startDate: startDate,
        endDate: endDate,
        name: 'Visita ' + i,
        customerId: '1',
        customerName: 'Eduardo Simón',
      });

    }
    console.log(appointments);
    return appointments;
  }

  public getAppointmentDuration(appointment: Appointment){
    const dur =  appointment.endDate.getMinutes() + appointment.startDate.getMinutes();
    console.log(dur);
    return dur;
  }
}
