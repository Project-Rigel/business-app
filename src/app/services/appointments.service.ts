import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FunctionNames } from '../constants';
import { AgendaDay } from '../interfaces/agendaDay';
import { Appointment } from '../interfaces/appointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  guidedBookingCallable = this.functions.httpsCallable(
    FunctionNames.BOOK_APPOINTMENT_GUIDED,
  );
  private appointments: BehaviorSubject<Appointment[]> = new BehaviorSubject<
    Appointment[]
  >([]);
  appointmentInterval = 30;
  //de 0 a 23 horas
  startHour = 7;
  endHour = 23;
  appointmentToBeConfirmed: Appointment;
  public appointments$: Observable<
    Appointment[]
  > = this.appointments.asObservable();

  constructor(
    private afs: AngularFirestore,
    private functions: AngularFireFunctions,
  ) {}

  private static getStringDate(date: Date) {
    const month = date.getMonth(); //months from 1-12
    const day = date.getDate();
    const year = date.getFullYear();

    return day + '_' + month + '_' + year;
  }

  getAllPossibleAppointments() {
    const total: Date[] = [];
    const nAppointments: number = Math.trunc(
      ((this.endHour - this.startHour) * 60) / this.appointmentInterval,
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

  updateDayAppointments(agendaId: string, date = new Date()) {
    const strDate = AppointmentsService.getStringDate(date);

    return this.afs
      .doc(`agendas/${agendaId}`)
      .collection<AgendaDay>('appointments')
      .doc<AgendaDay>(`${strDate}-${agendaId}`)
      .valueChanges()
      .pipe(
        map(v => {
          if (v) {
            this.appointments.next(
              Object.values(v).map(
                (v: any): Appointment => {
                  return {
                    startDate: new Date(Date.parse(v.startDate)),
                    id: v.id,
                    customerName: v.customerName,
                    endDate: new Date(Date.parse(v.endDate)),
                    customerId: v.customerId,
                    name: v.name,
                  };
                },
              ),
            );
          } else {
            this.appointments.next([]);
          }
          return this.appointments.value;
        }),
      );
  }

  updatePossibleAppointment(appointment: Appointment) {
    const appointToShow = this.appointments?.value.filter(
      v => v.id !== appointment.id,
    );
    appointToShow.push(appointment);
    this.appointments.next(appointToShow);
    this.appointmentToBeConfirmed = appointment;
  }

  async confirmNewAppointment(
    businessId: string,
    agendaId: string,
    productId: string,
    customerId: string,
    type: 'guided' | 'custom',
  ) {
    if (this.appointmentToBeConfirmed) {
      if (type === 'guided') {
        console.log(this.guidedBookingCallable);
        this.guidedBookingCallable({
          customerId: customerId,
          businessId: businessId,
          productId: productId,
          startDate: this.appointmentToBeConfirmed.startDate.toISOString(),
          agendaId: agendaId,
        }).subscribe(
          res => console.log(res),
          err => console.error(err),
        );
      }
    }
    this.appointmentToBeConfirmed = null;
  }

  restoreExistingAppointment(appointment: Appointment) {
    if (appointment) {
      const appointToShow = this.appointments?.value;
      let i = -1;
      appointToShow.forEach((element, index) => {
        if (element.id === appointment.id) {
          i = index;
        }
      });
      if (i != -1) appointToShow[i] = appointment;
      this.appointments.next(appointToShow);
    }
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
