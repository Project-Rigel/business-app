import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  AnimationController,
  IonDatetime,
  ModalController,
} from '@ionic/angular';
import { Animation } from '@ionic/core';
import * as moment from 'moment';
import { duration, Duration, Moment } from 'moment';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { Agenda } from '../../interfaces/agenda';
import { Appointment } from '../../interfaces/appointment';
import { Customer } from '../../interfaces/customer';
import { Product } from '../../interfaces/product';
import { AgendaService } from '../../services/agenda.service';
import { AppointmentsService } from '../../services/appointments.service';
import { AuthService } from '../../services/auth.service';
import { AddAppointmentWizardComponent } from '../add-appointment-wizard/add-appointment-wizard.component';

interface DisplayItem {
  appointment?: Appointment;
  interval: Date;
  appointmentHeight?: number;
  pxFromLast?: number;
}

@Component({
  selector: 'app-agenda-details',
  templateUrl: './agenda-details.page.html',
  styleUrls: ['./agenda-details.page.scss'],
})
export class AgendaDetailsPage implements OnInit {
  closeCalendar: Animation;
  openCalendar: Animation;
  closeConfirmApoointment: Animation;
  openConfirmAppoinment: Animation;
  isCalendarOpen = true;
  isConfirmAppointmentOpen = false;
  display: DisplayItem[] = [];
  @ViewChild(DatePickerComponent)
  datePicker: DatePickerComponent;
  calendarButtonColor = 'primary';
  agenda$: Observable<Agenda>;
  addingAppointment = false;
  addingAppointmentInfo: {
    intervals: { from: string; to: string }[];
    customer: Customer;
    product: Product;
  };
  appoinmentGaps: string[] = [];
  startDate: Moment;
  endDate: Moment;
  interval: Duration;
  dateTimeInitialValue: Moment;
  dateTimeValue = new Date();
  selectedStartTime = false;
  possibleAppointmentId: string;
  appointment;
  exisitingAppointment = null;
  dayAppointments: Appointment[] = [];
  productDuration: Duration;
  businessId: string;

  @ViewChild(IonDatetime) dateTime: IonDatetime;
  public loading: boolean;

  constructor(
    private animationController: AnimationController,
    public appointmentsService: AppointmentsService,
    private agendaService: AgendaService,
    public route: ActivatedRoute,
    private modalController: ModalController,
    public alertController: AlertController,
    private auth: AuthService,
  ) {
    this.startDate = moment(new Date().setHours(7, 0, 0, 0));
    this.endDate = moment(new Date().setHours(23, 0, 0, 0));
    this.interval = duration(30, 'minutes');
    this.dateTimeInitialValue = moment(
      new Date().setHours(this.startDate.get('hours')),
    );
    const value = this.route.snapshot.paramMap.get('id');
    this.agenda$ = this.agendaService.getAgendaById(value);

    this.appointmentsService.appointments$.subscribe(data => {
      this.dayAppointments = data;
    });

    this.auth.user$.subscribe(user => {
      if (user) {
        this.businessId = user.businessId;
      }
    });
  }

  ngOnInit() {
    this.updateAppointments(new Date());
  }

  ionViewDidEnter() {
    this.closeCalendar = this.animationController
      .create()
      .addElement(document.getElementById('date-container'))
      .duration(400)
      .fromTo('height', '246px', '0px')
      .easing('ease-in-out');

    this.openCalendar = this.animationController
      .create()
      .addElement(document.getElementById('date-container'))
      .duration(400)
      .fromTo('height', '0px', '246px')
      .easing('ease-in-out');

    this.closeConfirmApoointment = this.animationController
      .create()
      .addElement(document.getElementById('confirm-container'))
      .duration(400)
      .fromTo('height', '200px', '0px')
      .easing('ease-in-out');

    this.openConfirmAppoinment = this.animationController
      .create()
      .addElement(document.getElementById('confirm-container'))
      .duration(400)
      .fromTo('height', '0px', '200px')
      .easing('ease-in-out');
  }

  onDateChange(event) {
    this.startDate = moment(event.setHours(7, 0, 0, 0));
    this.endDate = moment(event.setHours(23, 0, 0, 0));
    this.dateTimeValue = event;
    this.updateAppointments(event);
  }

  async showCalendar() {
    this.calendarButtonColor = this.isCalendarOpen ? 'medium' : 'primary';
    this.openCalendar.stop();
    this.closeCalendar.stop();
    this.isCalendarOpen
      ? await this.closeCalendar.play()
      : await this.openCalendar.play();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  async showConfirmApoointmentDialog() {
    this.openConfirmAppoinment.stop();
    this.closeConfirmApoointment.stop();
    this.isConfirmAppointmentOpen
      ? await this.closeConfirmApoointment.play()
      : await this.openConfirmAppoinment.play();
    this.isConfirmAppointmentOpen = !this.isConfirmAppointmentOpen;
  }

  async startAddAppointmentWizard() {
    const modal = await this.modalController.create({
      component: AddAppointmentWizardComponent,
      swipeToClose: true,
      componentProps: {
        //display: this.display,
        agendaId: this.route.snapshot.paramMap.get('id'),
        daySelected: this.dateTimeValue,
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.done) {
        this.addingAppointment = true;
        this.addingAppointmentInfo = data;

        this.showConfirmApoointmentDialog();
        let intervals = this.addingAppointmentInfo.intervals;
        console.log('Intervals received from functions: ');
        console.log(intervals);

        intervals = [
          {
            from: '08:00',
            to: '14:00',
          },
          {
            from: '17:00',
            to: '20:00',
          },
        ];

        const productDuration = moment.duration(
          this.addingAppointmentInfo.product.duration,
          'minutes',
        );

        for (const gap of intervals) {
          for (
            let item = moment(gap.from, 'HH:mm');
            moment(gap.to, 'HH:mm').diff(item) > 0;
            item.add(productDuration.asMinutes(), 'minutes')
          ) {
            const aux = moment(item);
            if (
              moment(gap.to, 'HH:mm').diff(
                aux.add(productDuration.asMinutes(), 'minutes'),
              ) >= 0
            ) {
              if (!this.dayAppointments || this.dayAppointments.length === 0) {
                this.appoinmentGaps.push(item.format('HH:mm'));
              } else {
                const possibleEndMoment = moment(item, 'HH:mm').add(
                  productDuration.asMinutes(),
                  'minutes',
                );
                let canAdd = true;
                const itemDate = item.toDate();
                itemDate.setDate(this.dayAppointments[0].startDate.getDate());
                itemDate.setMonth(this.dayAppointments[0].startDate.getMonth());
                itemDate.setFullYear(
                  this.dayAppointments[0].startDate.getFullYear(),
                );

                const possibleEndDate = possibleEndMoment.toDate();
                possibleEndDate.setDate(
                  this.dayAppointments[0].startDate.getDate(),
                );
                possibleEndDate.setMonth(
                  this.dayAppointments[0].startDate.getMonth(),
                );
                possibleEndDate.setFullYear(
                  this.dayAppointments[0].startDate.getFullYear(),
                );

                this.dayAppointments.forEach(appointment => {
                  if (
                    !(
                      appointment.startDate.getTime() <= itemDate.getTime() &&
                      appointment.endDate.getTime() > itemDate.getTime()
                    ) && // Si el item esta entre una cita
                    !(
                      appointment.startDate.getTime() <
                        possibleEndDate.getTime() &&
                      appointment.endDate.getTime() > possibleEndDate.getTime()
                    ) && // Si el posibleFin esta entre una cita
                    !(
                      appointment.startDate.getTime() > itemDate.getTime() &&
                      appointment.endDate.getTime() < possibleEndDate.getTime()
                    )
                  )
                    // Si hay una cita entre el item y el posible final
                    console.log('No añadir tramo');
                  else {
                    canAdd = false;
                  }
                });
                if (canAdd) {
                  this.appoinmentGaps.push(item.format('HH:mm'));
                }
              }
            }
          }
        }
      }
    }
  }

  /* isBetweenAppointment(appointment: Appointment, date: Date): boolean {
    return (
      appointment.startDate.getTime() < date.getTime() &&
      appointment.endDate.getTime() >= date.getTime()
    );
  } */

  selectTime($event) {
    this.updatePossibleAppointment($event);
    this.selectedStartTime = !this.selectedStartTime;
    this.showConfirmApoointmentDialog();
  }

  async updatePossibleAppointment($event: any) {
    let hour = parseInt($event.target.innerText.split(':')[0]);
    let minutes = parseInt($event.target.innerText.split(':')[1]);
    if (isNaN(hour)) {
      hour = parseInt($event.target.parentNode.innerText.split(':')[0]);
      minutes = parseInt($event.target.parentNode.innerText.split(':')[1]);
    }

    this.dateTimeValue.setHours(hour);
    this.dateTimeValue.setMinutes(minutes);
    this.dateTimeValue.setSeconds(0);
    this.dateTimeValue.setMilliseconds(0);

    if (!this.possibleAppointmentId) {
      this.possibleAppointmentId = this.appointmentsService.getId();
    }
    /* 
    /////////////////
    let sharesStartDate: boolean;
    let sharingPosition: number;
    let numberOfAppointmentsAtStartDate = 0;
    let index = 0;

    this.dayAppointments.forEach((element, i) => {
      element.startDate.setSeconds(this.dateTimeValue.getSeconds());
      element.startDate.setMilliseconds(this.dateTimeValue.getMilliseconds());
      element.endDate.setSeconds(this.dateTimeValue.getSeconds());
      element.endDate.setMilliseconds(this.dateTimeValue.getMilliseconds());

      if (
        element.startDate.getTime() <= this.dateTimeValue.getTime() &&
        element.endDate.getTime() > this.dateTimeValue.getTime()
      ) {
        // Cambiar por en rato de cita entero
        numberOfAppointmentsAtStartDate++; // Parte derecha
        index = i;
      }
    });

    if (numberOfAppointmentsAtStartDate === 0) {
      // Si array de citas contiene x elementos, entonces ...
      sharesStartDate = false;
      sharingPosition = 0; // enum
      console.log('Cita sola');
    } else if (numberOfAppointmentsAtStartDate === 1) {
      this.appointmentsService.updateTemporallyExisitingAppointment(
        this.dayAppointments[index],
      );
      this.exisitingAppointment = this.dayAppointments[index];

      sharesStartDate = true;
      sharingPosition = 2;
      console.log('Cita doble');
    } else {
      console.log('Error, más de 2 citas');
      return;
      // return error o alerta
    }

    //////////////// */
    const productDuration = moment.duration(
      this.addingAppointmentInfo.product.duration,
      'minutes',
    );
    this.appointment = {
      id: this.possibleAppointmentId,
      startDate: this.dateTimeValue,
      endDate: moment(this.dateTimeValue)
        .add(productDuration)
        .toDate(),
      name: this.addingAppointmentInfo.product.name,
      customerId: this.addingAppointmentInfo.customer.id,
      customerName: this.addingAppointmentInfo.customer.name,
      /* sharesStartTimeWithOtherAppointment: sharesStartDate,
      positionSharing: sharingPosition, */
      // cita: null : []
    };
    this.appointmentsService.updatePossibleAppointment(this.appointment);
  }

  async confirmAppointments(agendaId: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cita confirmada',
      message: 'Fecha: ' + this.dateTimeValue,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Ok',
          handler: async () => {
            try {
              this.loading = true;
              await this.appointmentsService.confirmNewAppointment(
                this.businessId,
                agendaId,
                this.addingAppointmentInfo.product.id,
                this.addingAppointmentInfo.customer.id,
              );
              this.loading = false;
              this.addingAppointmentInfo = null;
              this.addingAppointment = false;
            } catch (e) {
              this.loading = false;
            }
          },
        },
      ],
    });
    await alert.present();
    this.selectedStartTime = !this.selectedStartTime;
    this.possibleAppointmentId = null;
    this.appointment = null;
    this.exisitingAppointment = null;
    this.appoinmentGaps = [];
  }

  private updateAppointments(date: Date) {
    this.agenda$
      .pipe(
        switchMap(agenda => {
          return this.appointmentsService.updateDayAppointments(
            agenda.id,
            date,
          );
        }),
        take(1),
      )
      .subscribe(v => v);
  }

  cancelAddAppointment() {
    this.addingAppointment = false;
    this.addingAppointmentInfo = null;
    this.appoinmentGaps = [];
    if (this.appointment != null) {
      this.appointmentsService.cancelAppointment(this.appointment);
      this.appointment = null;
    }
    if (this.exisitingAppointment != null) {
      this.appointmentsService.restoreExistingAppointment(
        this.exisitingAppointment,
      );
      this.exisitingAppointment = null;
    }

    if (this.selectedStartTime) {
      this.selectedStartTime = !this.selectedStartTime;
    }

    this.possibleAppointmentId = null;
  }
}
