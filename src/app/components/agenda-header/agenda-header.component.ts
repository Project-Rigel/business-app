import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-agenda-header',
  templateUrl: './agenda-header.component.html',
  styleUrls: ['./agenda-header.component.scss'],
})
export class AgendaHeaderComponent {
  @Input() calendarButtonColor: string;
  @Input() isAddingAppointment: boolean;
  @Output() onCalendarButtonPressed = new EventEmitter<boolean>();
  @Output() onAddAppointmentButtonPressed = new EventEmitter<boolean>();
  @Output() onCancelAddAppointmentButtonPressed = new EventEmitter<boolean>();

  async calendarButtonPressed() {
    await this.onCalendarButtonPressed.emit(true);
  }

  async addAppointmentButtonPressed() {
    await this.onAddAppointmentButtonPressed.emit(true);
  }

  async cancelAddAppointmentButtonPressed() {
    await this.onCancelAddAppointmentButtonPressed.emit(true);
  }
}
