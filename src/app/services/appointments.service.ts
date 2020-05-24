import { Injectable } from '@angular/core';
import { Appointment } from '../interfaces/appointment';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgendaDay } from '../interfaces/agendaDay';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  appointmentInterval = 30;
  //de 0 a 23 horas
  startHour = 9;
  endHour = 18;
  constructor(private afs: AngularFirestore) {}

  getAllPossibleAppointments() {
    const total = [];
    const nAppointments: number = Math.trunc(
      ((18 - 9) * 60) / this.appointmentInterval,
    );
    const date = new Date();
    date.setHours(this.startHour, 0, 0);

    for (let i = 0; i < nAppointments; i++) {
      total.push(
        moment(date)
          .add(this.appointmentInterval * i, 'm')
          .toDate(),
      );
    }

    console.log(total);
    return total;
  }
  getDayAppointments(
    agendaId: string,
    date = new Date(),
  ): Observable<AgendaDay> {
    const month = date.getMonth() + 1; //months from 1-12
    const day = date.getDate();
    const year = date.getFullYear();

    const strDate = year + '/' + month + '/' + day;

    console.log(strDate);
    console.log(agendaId);
    return this.afs
      .doc(`agendas/${agendaId}`)
      .collection<AgendaDay>('days')
      .doc<AgendaDay>(`${agendaId}-${strDate}`)
      .valueChanges();

    // const appointments: Appointment[] = [];
    // const nAppointments: number = Math.trunc(
    //   ((18 - 9) * 60) / this.appointmentInterval,
    // );
    // const date = new Date();
    // date.setHours(this.startHour, 0, 0);
    // console.log(
    //   moment(date)
    //     .add(this.appointmentInterval, 'm')
    //     .toDate(),
    // );
    // let startDate = null;
    // let endDate = date;
    // for (let i = 0; i < 8; i++) {
    //   if (startDate === null) {
    //     startDate = moment(date)
    //       .add(this.appointmentInterval * i, 'm')
    //       .toDate();
    //   } else {
    //     startDate = endDate;
    //   }
    //
    //   if (i === 3) {
    //     endDate = moment(startDate)
    //       .add(this.appointmentInterval * 4, 'm')
    //       .toDate();
    //   } else if (i === 4) {
    //     endDate = moment(startDate)
    //       .add(this.appointmentInterval * 4.2, 'm')
    //       .toDate();
    //   } else {
    //     endDate = moment(startDate)
    //       .add(this.appointmentInterval * 2, 'm')
    //       .toDate();
    //   }
    //
    //   const diff = moment(startDate).diff(moment(endDate), 'm');
    //   console.log(diff);
    //
    //   appointments.push({
    //     startDate: startDate,
    //     endDate: endDate,
    //     name: 'Visita ' + i,
    //     customerId: '1',
    //     customerName: 'Eduardo Simón',
    //   });
    // }
    // console.log(appointments);
    // return appointments;
  }

  public getAppointmentDuration(appointment: Appointment) {
    const dur =
      appointment.endDate.getMinutes() + appointment.startDate.getMinutes();
    console.log(dur);
    return dur;
  }

  public getJourneyDurationInMinutes() {
    return (this.endHour - this.startHour) * 60;
  }
}
