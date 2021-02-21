import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AnimationController,
  IonRouterOutlet,
  ModalController,
} from '@ionic/angular';
import { Animation } from '@ionic/core';
import moment, { duration, Duration, Moment } from 'moment';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AppointmentSelectionTypeModalComponent } from '../components/appointment-selection-type-modal/appointment-selection-type-modal.component';
import { Agenda } from '../interfaces/agenda';
import { AgendaConfig } from '../interfaces/agenda-config';
import { Customer } from '../interfaces/customer';
import { Interval } from '../interfaces/interval';
import { Product } from '../interfaces/product';
import { AgendaService } from '../services/agenda.service';
import { AlertService } from '../services/alert.service';
import { AppointmentsService } from '../services/appointments.service';
import { AuthService } from '../services/auth.service';
import { GetAgendaConfigService } from '../services/get-agenda-config.service';
import { LoaderService } from '../services/loader.service';
import { AddAppointmentWizardComponent } from './add-appointment-wizard/add-appointment-wizard.component';

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
  agendaConfig$: Observable<any>;
  intervals$: Observable<Interval[]>;
  appointmentType: 'guided' | 'custom';

  startDate: Moment;
  endDate: Moment;
  interval: Duration;

  openedAppointmentSelection = false;

  private dateChangeSubject: BehaviorSubject<any>;

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
    private routerOutlet: IonRouterOutlet,
  ) {
    this.startDate = moment(new Date().setHours(7, 0, 0, 0));
    this.endDate = moment(new Date().setHours(23, 0, 0, 0));
    this.interval = duration(30, 'minutes');
    this.agendaId = this.route.snapshot.paramMap.get('id');
    this.agenda$ = this.agendaService.getAgendaById(this.agendaId);
    this.dateChangeSubject = new BehaviorSubject<any>(new Date());
    this.agendaConfig$ = this.auth.user$.pipe(
      switchMap(user => {
        this.businessId = user.businessId;
        return this.intervalService.endpoint({
          agendaId: this.agendaId,
          businessId: this.businessId,
          showOnlyValidConfig: true,
        });
      }),
      take(1),
    );

    this.intervals$ = combineLatest(
      this.agendaConfig$,
      this.dateChangeSubject.asObservable(),
    ).pipe(
      switchMap(configs => {
        let filteredConfigs = configs[0].filter(config => {
          return this.belongsToSelectedDate(config);
        });

        if (filteredConfigs.length > 1) {
          filteredConfigs = filteredConfigs.filter(config => {
            return config.specificDate !== null;
          });
        }
        return of(filteredConfigs[0]?.intervals);
      }),
    );
  }

  async ngOnInit() {
    await this.loader.showLoader();
    // Sin esto no se inicializa de entrada porque los observables están trabajando
    setTimeout(async () => {
      this.onDateChange(new Date());
      await this.loader.hideLoader();
    }, 1500);
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
    this.dateChangeSubject.next(event);
  }

  belongsToSelectedDate(config: AgendaConfig): boolean {
    if (config.dayOfWeek && config.dayOfWeek === this.dateTimeValue.getDay()) {
      return true;
    }
    if (config.specificDate) {
      const date = moment(config.specificDate).toDate();
      if (
        date.getDate() === this.dateTimeValue.getDate() &&
        date.getMonth() === this.dateTimeValue.getMonth() &&
        date.getFullYear() === this.dateTimeValue.getFullYear()
      ) {
        return true;
      }
    }
    return false;
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

  async openAppointmentSelectionTypeModal() {
    if (!this.openedAppointmentSelection) {
      this.openedAppointmentSelection = true;
      const modal = await this.modalController.create({
        component: AppointmentSelectionTypeModalComponent,
        swipeToClose: true,
        backdropDismiss: true,
        showBackdrop: true,
        presentingElement: this.routerOutlet.parentOutlet.nativeEl,
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
      this.openedAppointmentSelection = false;
      if (data && data.done) {
        this.appointmentType = data.value.type;
        if (data.value.type === 'guided') {
          await this.startAddAppointmentWizard(data.value.type);
        } else {
          await this.alertService.presentSimpleAlert(
            'Funcionalidad no disponible',
            'Aun no esta disponible la siguiente funcionalidad.',
          );
        }
      }
    }
  }

  async startAddAppointmentWizard(type: any) {
    const modal = await this.modalController.create({
      component: AddAppointmentWizardComponent,
      swipeToClose: true,
      componentProps: {
        agendaId: this.route.snapshot.paramMap.get('id'),
        daySelected: this.dateTimeValue,
        appointmentType: type,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.done) {
      this.getAndShowAppointmentGaps(data);
    }
  }

  getAndShowAppointmentGaps(possibleAppointmentInfo: {
    done: boolean;
    customer: Customer;
    product: Product;
  }) {
    this.addingAppointment = true;
    this.addingAppointmentInfo = possibleAppointmentInfo;
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
        this.appointmentType,
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
    this.dateTimeValue = new Date(event);
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
