import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimationController, ModalController } from '@ionic/angular';
import { Animation } from '@ionic/core';
import * as moment from 'moment';
import { duration, Duration, Moment } from 'moment';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Agenda } from '../../interfaces/agenda';
import { Customer } from '../../interfaces/customer';
import { Interval } from '../../interfaces/interval';
import { Product } from '../../interfaces/product';
import { AgendaService } from '../../services/agenda.service';
import { AlertService } from '../../services/alert.service';
import { AppointmentsService } from '../../services/appointments.service';
import { AuthService } from '../../services/auth.service';
import { GetAgendaConfigService } from '../../services/get-agenda-config.service';
import { LoaderService } from '../../services/loader.service';
import { AddAppointmentWizardComponent } from '../add-appointment-wizard/add-appointment-wizard.component';

@Component({
  selector: 'app-agenda-details',
  templateUrl: './agenda-details.page.html',
  styleUrls: ['./agenda-details.page.scss'],
})
export class AgendaDetailsPage implements OnInit {
  closeCalendar: Animation;
  openCalendar: Animation;
  isCalendarOpen = true;
  calendarButtonColor = 'primary';

  appointmentGaps: string[] = [];

  agenda$: Observable<Agenda>;
  addingAppointment = false;
  addingAppointmentInfo: {
    intervals: { from: string; to: string }[];
    customer: Customer;
    product: Product;
  };
  dateTimeValue = new Date();
  selectedStartTime = false;
  possibleAppointmentId: string;
  appointment;
  existingAppointment = null;
  businessId: string;
  agendaId: string;
  intervals: Interval[];

  startDate: Moment;
  endDate: Moment;
  interval: Duration;

  constructor(
    private animationController: AnimationController,
    public appointmentsService: AppointmentsService,
    public intervalService: GetAgendaConfigService,
    private agendaService: AgendaService,
    public route: ActivatedRoute,
    private modalController: ModalController,
    public alertService: AlertService,
    private auth: AuthService,
    private loader: LoaderService,
    private chRef: ChangeDetectorRef,
  ) {
    this.startDate = moment(new Date().setHours(7, 0, 0, 0));
    this.endDate = moment(new Date().setHours(23, 0, 0, 0));
    this.interval = duration(30, 'minutes');
    const value = this.route.snapshot.paramMap.get('id');
    this.agenda$ = this.agendaService.getAgendaById(value);

    this.auth.user$.subscribe(async user => {
      if (user) {
        this.businessId = user.businessId;
        await this.intervalService
          .endpoint({
            agendaId: value,
            businessId: this.businessId,
            showOnlyValidConfig: true,
          })
          .pipe(take(1))
          .subscribe(
            async (configs: any) => {
              configs.map(data => {
                this.intervals = data.intervals;
                this.chRef.detectChanges();
              });
            },
            async err => {
              console.log(err);
            },
          );
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
  }

  onDateChange(event) {
    this.startDate = moment(event.setHours(7, 0, 0, 0));
    this.endDate = moment(event.setHours(23, 0, 0, 0));
    this.dateTimeValue = event;
    this.updateAppointments(event);
  }

  async showOrHideCalendar() {
    this.calendarButtonColor = this.isCalendarOpen ? 'medium' : 'primary';
    this.openCalendar.stop();
    this.closeCalendar.stop();
    this.isCalendarOpen
      ? await this.closeCalendar.play()
      : await this.openCalendar.play();
    this.isCalendarOpen = !this.isCalendarOpen;
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
    if (data && data.done) {
      this.getAndShowAppointmentGaps(data);
    }
  }

  getAndShowAppointmentGaps(possibleAppointmentInfo: any) {
    this.addingAppointment = true;
    this.addingAppointmentInfo = possibleAppointmentInfo;
    const intervals = this.addingAppointmentInfo.intervals;
    for (const gap of intervals) {
      const item = moment(gap.from).utc(true);
      this.appointmentGaps.push(item.format('HH:mm'));
    }
  }

  async onSelectedTime($event) {
    await this.formatDateTimeValueFromChipString($event);
    await this.updatePossibleAppointment();
    this.selectedStartTime = !this.selectedStartTime;
  }

  async updatePossibleAppointment() {
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
    this.agendaId = agendaId;
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
    const result = await this.alertService.presentOkCancelAlert(
      '¿Quiere confirmar la cita con los siguiente datos?',
      message,
    );
    result.pipe(take(1)).subscribe(async res => {
      if (res) {
        await this.confirmNewAppointment(this.agendaId);
      }
    });
  }

  async confirmNewAppointment(agendaId: string) {
    try {
      await this.loader.showLoader();
      await this.appointmentsService.confirmNewAppointment(
        this.businessId,
        agendaId,
        this.addingAppointmentInfo.product.id,
        this.addingAppointmentInfo.customer.id,
      );
      this.clearPossibleAppointmentData();
      await this.loader.hideLoader();
      await this.alertService.presentSimpleAlert(
        'Éxito',
        'La cita se ha confirmado con éxito.',
      );
    } catch (e) {
      await this.loader.hideLoader();
      await this.alertService.presentSimpleAlert(
        'Error',
        'Se ha producido un error inesperado. Vuelva a intentarlo en unos instantes.',
      );
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
    this.appointmentGaps = [];
    if (this.appointment != null) {
      this.appointmentsService.cancelAppointment(this.appointment);
      this.appointment = null;
    }
    if (this.existingAppointment != null) {
      this.appointmentsService.restoreExistingAppointment(
        this.existingAppointment,
      );
      this.existingAppointment = null;
    }
    if (this.selectedStartTime)
      this.selectedStartTime = !this.selectedStartTime;
    this.possibleAppointmentId = null;
  }

  clearPossibleAppointmentData() {
    this.addingAppointmentInfo = null;
    this.addingAppointment = false;
    this.selectedStartTime = !this.selectedStartTime;
    this.possibleAppointmentId = null;
    this.appointment = null;
    this.existingAppointment = null;
    this.appointmentGaps = [];
  }

  formatDateTimeValueFromChipString(event) {
    let hour = parseInt(event.target.innerText.split(':')[0]);
    let minutes = parseInt(event.target.innerText.split(':')[1]);
    if (isNaN(hour)) {
      hour = parseInt(event.target.parentNode.innerText.split(':')[0]);
      minutes = parseInt(event.target.parentNode.innerText.split(':')[1]);
    }

    this.dateTimeValue.setHours(hour);
    this.dateTimeValue.setMinutes(minutes);
    this.dateTimeValue.setSeconds(0);
    this.dateTimeValue.setMilliseconds(0);

    if (!this.possibleAppointmentId) {
      this.possibleAppointmentId = this.appointmentsService.getId();
    }
  }

  capitalize(text: string) {
    if (typeof text !== 'string') return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
