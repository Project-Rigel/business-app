import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, AnimationController, IonDatetime, ModalController } from '@ionic/angular';
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
import { Time } from 'dayspan';

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
  appoinmentGaps: string[] = []
  startDate: Moment;
  endDate: Moment;
  interval: Duration;
  dateTimeInitialValue: Moment;
  dateTimeValue = new Date();
  selectedStartTime: boolean = false;
  possibleAppointmentId: string;

  @ViewChild(IonDatetime) dateTime: IonDatetime;
  public loading: boolean;

  constructor(
    private animationController: AnimationController,
    public appointmentsService: AppointmentsService,
    private agendaService: AgendaService,
    public route: ActivatedRoute,
    private modalController: ModalController,
    public alertController: AlertController,
  ) {
    this.startDate = moment(new Date().setHours(9, 0, 0, 0));
    this.endDate = moment(new Date().setHours(18, 0, 0, 0));
    this.interval = duration(30, 'minutes');
    this.dateTimeInitialValue = moment(new Date().setHours(this.startDate.get('hours')));
    const value = this.route.snapshot.paramMap.get('id');
    this.agenda$ = this.agendaService.getAgendaById(value);
  }

  ngOnInit() {
    this.updateAppointments(new Date());
  }

  ionViewDidEnter() {
    this.closeCalendar = this.animationController
      .create()
      .addElement(document.getElementById('date-container'))
      .duration(400)
      .fromTo('height', '200px', '0px')
      .easing('ease-in-out');

    this.openCalendar = this.animationController
      .create()
      .addElement(document.getElementById('date-container'))
      .duration(400)
      .fromTo('height', '0px', '200px')
      .easing('ease-in-out');
  }

  onDateChange(event) {
    this.startDate = moment(event.setHours(9, 0, 0, 0));
    this.endDate = moment(event.setHours(18, 0, 0, 0));
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

  async startAddAppointmentWizard() {
    const modal = await this.modalController.create({
      component: AddAppointmentWizardComponent,
      swipeToClose: true,
      componentProps: {
        display: this.display,
        agendaId: this.route.snapshot.paramMap.get('id'),
        daySelected: this.dateTimeValue
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.done) {
        this.addingAppointment = true;
        this.addingAppointmentInfo = data;

        // Calculamos las horas disponibles teniendo en cuenta los intervalos y la duración de los productos
        const intervals = this.addingAppointmentInfo.intervals;
        const productDuration = this.addingAppointmentInfo.product.duration;
        for (const gap of intervals) {
          for (let item = moment(gap.from, 'HH:mm'); moment(gap.to, "HH:mm").diff(item) > 0; item.add(this.interval.asMinutes(), 'minutes')) {
            console.log(item.format("HH:mm"));
            const aux = moment(item)
            if (moment(gap.to, "HH:mm").diff(aux.add(productDuration.asMinutes(), 'minutes')) >= 0) {
              this.appoinmentGaps.push(item.format("HH:mm"))
            }
          }
        }
      }
    }
  }

  selectTime($event) {
    this.updatePossibleAppointment($event)
    this.selectedStartTime=!this.selectedStartTime;
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

    if (!this.possibleAppointmentId) {
      this.possibleAppointmentId = this.appointmentsService.getId();
    }

    const appointment = {
      id: this.possibleAppointmentId,
      startDate: this.dateTimeValue,
      endDate: moment(this.dateTimeValue).add(this.addingAppointmentInfo.product.duration).toDate(),
      name: this.addingAppointmentInfo.product.name,
      customerId: this.addingAppointmentInfo.customer.id,
      customerName: this.addingAppointmentInfo.customer.name,
    };
    this.appointmentsService.updatePossibleAppointment(appointment);
  }

  async confirmAppointments(agendaId: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        }, {
          text: 'Okay',
          handler: async () => {
            try {
              this.loading = true;
              await this.appointmentsService.confirmAppointments(agendaId);
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
        for (let i = start; i < end + 1; i++) {
          validHours.push(i);
        }
      });
    }

    return validHours;
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
        take(1)).subscribe(v => console.log(v));
  }

  cancelAddAppointment() {
    this.addingAppointment = false;
    this.addingAppointmentInfo = null;
    this.appoinmentGaps = []
  }
}
