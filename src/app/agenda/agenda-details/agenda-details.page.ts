import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { Animation } from '@ionic/core';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../interfaces/appointment';
import * as moment from 'moment';
import { AgendaService } from '../../services/agenda.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Agenda } from '../../interfaces/agenda';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-agenda-details',
  templateUrl: './agenda-details.page.html',
  styleUrls: ['./agenda-details.page.scss'],
})
export class AgendaDetailsPage implements OnInit {
  closeCalendar: Animation;
  openCalendar: Animation;
  isCalendarOpen: boolean = true;
  appointments: Appointment[] = [];
  allPossibleAppointments: any[] = [];
  display: any[] = [];
  @ViewChild(DatePickerComponent)
  datePicker: DatePickerComponent;
  calendarButtonColor = 'primary';
  agenda$: Observable<Agenda>;

  totalHeight = 1000;
  constructor(
    private animationController: AnimationController,
    public appointmentsService: AppointmentsService,
    private agendaService: AgendaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const value = this.route.snapshot.paramMap.get('id');
    console.log(value);
    this.agenda$ = this.agendaService.getAgendaById(value);

    this.agenda$.pipe(switchMap(agenda => {
      return this.appointmentsService.getDayAppointments(agenda.id, new Date());
    })).subscribe(appointments => {
      console.log(appointments);
    })
    this.allPossibleAppointments = this.appointmentsService.getAllPossibleAppointments();

    let lastValidAppointmentIndex = 0;
    let currentDate = undefined;

    for (let i = 0; i < this.allPossibleAppointments.length; i++) {
      for (
        let j = lastValidAppointmentIndex;
        j < this.appointments.length;
        j++
      ) {
        if (
          Math.floor(this.appointments[j].startDate.getTime() / 1000) ===
          Math.floor(this.allPossibleAppointments[i].getTime() / 1000)
        ) {
          currentDate = this.appointments[j];
          this.display.push({
            appointment: this.appointments[j],
            interval: this.allPossibleAppointments[i],
          });
          lastValidAppointmentIndex = j;
        }
      }

      if (!this.display[i]) {
        this.display.push({ interval: this.allPossibleAppointments[i] });
      }
    }

    let pxFromLast = 0;
    let appointmentHeight = 0;
    let currentAppointment = null;

    for (let i = 0; i < this.display.length; i++) {
      if (this.display[i].appointment) {
        currentAppointment = this.display[i].appointment;
        appointmentHeight += this.totalHeight / this.display.length;

        for (let j = i + 1; j < this.display.length; j++) {
          console.log('jagged', this.display[i]);
          if (
            !this.display[j].appointment &&
            this.display[j].interval < currentAppointment.endDate
          ) {
            appointmentHeight += this.totalHeight / this.display.length;
          }

          if (
            this.display[j].appointment ||
            this.display[j].interval >= currentAppointment.endDate
          ) {
            this.display[i].appointmentHeight = appointmentHeight;
            appointmentHeight = 0;
            currentAppointment = null;
            break;
          }
        }

        this.display[i].pxFromLast =
          pxFromLast >= this.display[i].appointmentHeight
            ? pxFromLast - this.display[i].appointmentHeight
            : 0;
        pxFromLast = 0;
      } else {
        pxFromLast += this.totalHeight / this.display.length;
      }
    }
    console.log(this.display);
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
    this.isCalendarOpen = !this.isCalendarOpen;
    this.calendarButtonColor = this.isCalendarOpen ? 'medium' : 'primary';
    this.openCalendar.stop();
    this.closeCalendar.stop();
    this.isCalendarOpen
      ? await this.closeCalendar.play()
      : await this.openCalendar.play();
  }

  async onReorder(event) {
    event.detail.complete();
  }

  getOccupationPercent() {
    return Math.floor(
      ((this.allPossibleAppointments.length - this.appointments.length) / 100) *
        100,
    );
  }

  shouldDrawHour(elem: any, i: number) {
    if (i === 0) {
      return true;
    }
    if (
      elem.appointments &&
      Math.floor(elem.appointment.startDate.getTime() / 1000) ===
        Math.floor(elem.interval.getTime() / 1000)
    ) {
      return true;
    }

    if (!elem.appointment && elem.interval) {
      return true;
    }

    return false;
  }
}
