import { DatePipe } from '@angular/common';
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

        await this.showConfirmApoointmentDialog();
        const intervals = this.addingAppointmentInfo.intervals;
        for (const gap of intervals) {
          const item = moment(gap.from, 'HH:mm');
          this.appoinmentGaps.push(item.format('HH:mm'));
        }
      }
    }
  }

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
    };
    this.appointmentsService.updatePossibleAppointment(this.appointment);
  }

  async showConfirmAppointment(agendaId: string) {
    const customerMessagePiece =
      '<strong>Cliente: </strong> ' +
      this.capitalize(this.addingAppointmentInfo.customer.name) +
      ' ' +
      this.capitalize(this.addingAppointmentInfo.customer.firstSurname) +
      ' ' +
      this.capitalize(this.addingAppointmentInfo.customer.secondSurname);
    const productMessagePiece =
      '<strong>Producto: </strong> ' +
      this.capitalize(this.addingAppointmentInfo.product.name);
    const dateMessagePiece =
      '<strong>Fecha: </strong> ' +
      new DatePipe('es-ES').transform(this.dateTimeValue, 'short');
    const message =
      customerMessagePiece +
      '<br>' +
      productMessagePiece +
      '<br>' +
      dateMessagePiece;
    const alert = await this.alertController.create({
      header: '¿Quiere confirmar la cita con los siguiente datos?',
      message: message,
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'OK',
          handler: async () => {
            await this.confirmNewAppointment(agendaId);
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmNewAppointment(agendaId: string) {
    try {
      this.loading = true;
      await this.appointmentsService.confirmNewAppointment(
        this.businessId,
        agendaId,
        this.addingAppointmentInfo.product.id,
        this.addingAppointmentInfo.customer.id,
      );
      this.clearPossibleAppointmentData();
      this.loading = false;
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'La cita se ha confirmado con éxito.',
        buttons: [
          {
            text: 'Aceptar',
          },
        ],
      });
      await alert.present();
    } catch (e) {
      this.loading = false;
      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'Se ha producido un error inesperado. Vuelva a intentarlo en unos instantes.',
        buttons: [
          {
            text: 'Aceptar',
          },
        ],
      });
      await alert.present();
    }
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

  clearPossibleAppointmentData() {
    this.addingAppointmentInfo = null;
    this.addingAppointment = false;
    this.selectedStartTime = !this.selectedStartTime;
    this.possibleAppointmentId = null;
    this.appointment = null;
    this.exisitingAppointment = null;
    this.appoinmentGaps = [];
  }

  capitalize(text: string) {
    if (typeof text !== 'string') return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
