import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { IonicModule } from '@ionic/angular';
import { AgendaNotificationsComponent } from './agenda-notifications/agenda-notifications.component';
import { TimelineAppointmentComponent } from './agenda-appointment/timeline-appointment.component';
import { DayTimelineComponent } from './day-timeline/day-timeline.component';

@NgModule({
  declarations: [
    DatePickerComponent,
    AgendaNotificationsComponent,
    TimelineAppointmentComponent,
    DayTimelineComponent,
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
