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

  height = 200;
  constructor(
    private animationController: AnimationController,
    public appointmentsService: AppointmentsService,
  ) {}

  ngOnInit() {
    this.appointments = this.appointmentsService.getDayAppointments(new Date());
    this.allPossibleAppointments = this.appointmentsService.getAllPossibleAppointments();

    let lastValidAppointmentIndex = 0;
    for (let i = 0; i < this.allPossibleAppointments.length; i++) {
      for (
        let j = lastValidAppointmentIndex;
        j < this.appointments.length;
        j++
      ) {
        console.log(
          { pne: Math.floor(this.appointments[j].startDate.getTime() / 1000) },
          { two: Math.floor(this.allPossibleAppointments[i].getTime() / 1000) },
        );
        if (
          Math.floor(this.appointments[j].startDate.getTime() / 1000) ===
          Math.floor(this.allPossibleAppointments[i].getTime() / 1000)
        ) {
          this.display.push({
            appointment: this.appointments[j],
            interval: this.allPossibleAppointments[i],
          });
          lastValidAppointmentIndex = j;
          console.log(this.display[this.display.length - 1]);
          break;
        }
      }

      if (!this.display[i]) {
        this.display.push({ interval: this.allPossibleAppointments[i] });
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
