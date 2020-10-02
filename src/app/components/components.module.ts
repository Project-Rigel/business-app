import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TimelineAppointmentComponent } from './agenda-appointment/timeline-appointment.component';
import { AgendaIntervalsComponent } from './agenda-intervals/agenda-intervals.component';
import { AgendaNotificationsComponent } from './agenda-notifications/agenda-notifications.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DayTimelineComponent } from './day-timeline/day-timeline.component';

@NgModule({
  declarations: [
    DatePickerComponent,
    AgendaNotificationsComponent,
    TimelineAppointmentComponent,
    DayTimelineComponent,
    AgendaIntervalsComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    DatePickerComponent,
    AgendaNotificationsComponent,
    TimelineAppointmentComponent,
    DayTimelineComponent,
  ],
})
export class ComponentsModule {}
