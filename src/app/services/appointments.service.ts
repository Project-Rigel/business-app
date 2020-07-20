import { Injectable } from '@angular/core';
import { Appointment } from '../interfaces/appointment';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AgendaDay } from '../interfaces/agendaDay';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private appointments: BehaviorSubject<Appointment[]> = new BehaviorSubject<Appointment[]>([]);
  public appointments$: Observable<Appointment[]> = this.appointments.asObservable();
  appointmentInterval = 30;
  //de 0 a 23 horas
  startHour = 9;
  endHour = 18;
  appointmentToBeConfirmed: Appointment;


  constructor(private afs: AngularFirestore) {
  }

  getAllPossibleAppointments() {
    const total: Date[] = [];
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

    return total;
  }

  updateDayAppointments(
    agendaId: string,
    date = new Date(),
  ) {
    const strDate = this.getStringDate(date);

    return this.afs
      .doc(`agendas/${agendaId}`)
      .collection<AgendaDay>('appointments')
      .doc<AgendaDay>(`${strDate}-${agendaId}`)
      .valueChanges().pipe(map(v => {
        if (v && v.appointments) {
          this.appointments.next(v.appointments.map((v: any): Appointment => {
              return {
                startDate: v.startDate.toDate(),
                id: v.id,
                customerName: v.customerName,
                endDate: v.endDate.toDate(),
                customerId: v.customerId,
                name: v.name,
              };
            },
          ));
        } else {
          this.appointments.next([]);
        }

        return this.appointments.value;
      }));
  }

  private getStringDate(date: Date) {
    const month = date.getMonth() + 1; //months from 1-12
    const day = date.getDate();
    const year = date.getFullYear();

    const strDate = year + '_' + month + '_' + day;
    return strDate;
  }

  updatePossibleAppointment(appointment: Appointment) {
    const appointToShow = this.appointments?.value.filter(v => v.id !== appointment.id);
    appointToShow.push(appointment);

    this.appointments.next(appointToShow);

    this.appointmentToBeConfirmed = appointment;
  }


  async confirmAppointments(agendaId: string) {
    if (this.appointmentToBeConfirmed) {
      await this.afs.doc(`agendas/${agendaId}`)
        .collection<AgendaDay>('appointments')
        .doc<any>(`${this.getStringDate(this.appointmentToBeConfirmed.startDate)}-${agendaId}`)
        .set({ appointments: firebase.firestore.FieldValue.arrayUnion(this.appointmentToBeConfirmed) }, {merge: true})
    }
    this.appointmentToBeConfirmed = null;
  }

  cancelAppointment(appointment: Appointment) {
    this.appointmentToBeConfirmed = null;
    const aux = this.appointments.value;
    const indexToRemove = this.appointments.value.indexOf(appointment);
    aux.splice(indexToRemove, 1);
    this.appointments.next(aux);
  }

  getId(): string {
    return this.afs.createId();
  }
}
