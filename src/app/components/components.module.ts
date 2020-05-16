import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { IonicModule } from '@ionic/angular';
import { AgendaNotificationsComponent } from './agenda-notifications/agenda-notifications.component';
import { AgendaAppointmentComponent } from './agenda-appointment/agenda-appointment.component';



@NgModule({
  declarations: [DatePickerComponent, AgendaNotificationsComponent, AgendaAppointmentComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [DatePickerComponent, AgendaNotificationsComponent, AgendaAppointmentComponent]
})
export class ComponentsModule { }
