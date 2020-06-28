import { Component, OnInit, ViewChild } from '@angular/core';
import { AnimationController, IonDatetime, ModalController } from '@ionic/angular';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { Animation } from '@ionic/core';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../interfaces/appointment';
import { AgendaService } from '../../services/agenda.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Agenda } from '../../interfaces/agenda';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AddAppointmentWizardComponent } from '../add-appointment-wizard/add-appointment-wizard.component';
import * as moment from 'moment';
import { duration, Duration, Moment } from 'moment';
import { Customer } from '../../interfaces/customer';
import { Product } from '../../interfaces/product';

interface DisplayItem {
  appointment?: Appointment;
  interval: Date;
  appointmentHeight?: number,
  pxFromLast?: number
}

@Component({
  selector: 'app-agenda-details',
  templateUrl: './agenda-details.page.html',
  styleUrls: ['./agenda-details.page.scss'],
})
export class AgendaDetailsPage implements OnInit {

  closeCalendar: Animation;
  openCalendar: Animation;
  isCalendarOpen: boolean = true;
  display: DisplayItem[] = [];
  @ViewChild(DatePickerComponent)
  datePicker: DatePickerComponent;
  calendarButtonColor = 'primary';
  agenda$: Observable<Agenda>;
  addingAppointment = false;
  addingAppointmentInfo: { intervals: { from: string, to: string }[], customer: Customer, product: Product };
  startDate: Moment;
  endDate: Moment;
  interval: Duration;
  dateTimeInitialValue: Moment;
  dateTimeValue = null;
  possibleAppointmentId: string;

  @ViewChild(IonDatetime) dateTime: IonDatetime;
  public loading: boolean;

  constructor(
    private animationController: AnimationController,
    public appointmentsService: AppointmentsService,
    private agendaService: AgendaService,
    public route: ActivatedRoute,
    private modalController: ModalController,
  ) {
    this.startDate = moment(new Date().setHours(9, 0, 0, 0));
    this.endDate = moment(new Date().setHours(18, 0, 0, 0));
    this.interval = duration(30, 'minutes');
    this.dateTimeInitialValue = moment(new Date().setHours(this.startDate.get('hours')));
    const value = this.route.snapshot.paramMap.get('id');
    this.agenda$ = this.agendaService.getAgendaById(value);
  }

  ngOnInit() {
    this.agenda$
      .pipe(
        switchMap(agenda => {
          return this.appointmentsService.updateDayAppointments(
            agenda.id,
            new Date(),
          );
        }),
        take(1)).subscribe(v => console.log(v));
  }

  ionViewDidEnter() {
    this.closeCalendar = this.animationController
      .create()
      .addElement(document.getElementById('date-container'))
      .duration(400)
      .fromTo('height', '250px', '0px')
      .easing('ease-in-out');

    this.openCalendar = this.animationController
      .create()
      .addElement(document.getElementById('date-container'))
      .duration(400)
      .fromTo('height', '0px', '250px')
      .easing('ease-in-out');
  }

  onDateChange(event) {
    console.log(event);
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

  async startAddAppointmentWizard() {
    const modal = await this.modalController.create({
      component: AddAppointmentWizardComponent,
      swipeToClose: true,
      componentProps: {
        display: this.display,
        agendaId: this.route.snapshot.paramMap.get('id'),
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.done) {
        this.addingAppointment = true;
        this.addingAppointmentInfo = data;
      }
    }
  }

  async updatePossibleAppointment($event: any) {
    this.dateTimeValue = new Date($event.detail.value);
    const date = new Date($event.detail.value);

    if (!this.possibleAppointmentId) {
      this.possibleAppointmentId = this.appointmentsService.getId();
    }

    const appointment = {
      id: this.possibleAppointmentId,
      startDate: date,
      endDate: moment(date).add(this.addingAppointmentInfo.product.duration).toDate(),
      name: this.addingAppointmentInfo.product.name,
      customerId: this.addingAppointmentInfo.customer.id,
      customerName: this.addingAppointmentInfo.customer.name,
    };
    this.appointmentsService.updatePossibleAppointment(appointment);
  }

  async confirmAppointments(agendaId: string) {
    try {
      this.loading = true;
      await this.appointmentsService.confirmAppointments(agendaId);
      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  }

  computeValidMinutes() {
    const minutes = [];
    if (this.addingAppointmentInfo) {
      let v = 60;

      while (v >= 0) {
        v -= this.addingAppointmentInfo.product.duration.asMinutes();
        minutes.push(v);
      }
    }

    return minutes;
  }

  computeValidHours() {
    const validHours = [];
    if (this.addingAppointmentInfo) {
      this.addingAppointmentInfo.intervals.forEach(v => {
        const start = Number.parseInt(v.from.split(':')[0]);
        const end = Number.parseInt(v.to.split(':')[0]);
        for (let i =start; i < end + 1; i++) {
          validHours.push(i);
        }
      });
    }

    return validHours;
  }
}
