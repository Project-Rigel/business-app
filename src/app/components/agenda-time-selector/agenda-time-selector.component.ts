import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-agenda-time-selector',
  templateUrl: './agenda-time-selector.component.html',
  styleUrls: ['./agenda-time-selector.component.scss'],
})
export class AgendaTimeSelectorComponent {
  @Input() isAddingAppointment: boolean;
  @Input() appointmentGaps: string[];
  @Input() dateTime: Date;
  @Input() selectedStartTime: boolean;
  @Output() onTimeChipSelected = new EventEmitter<string>();
  @Output() onTimeChipDeselected = new EventEmitter();
  @Output() onConfirmButtonPressed = new EventEmitter();

  async chipSelected(event) {
    await this.onTimeChipSelected.emit(event);
  }

  async chipDeselection() {
    await this.onTimeChipDeselected.emit();
  }

  async confirmButtonPressed() {
    await this.onConfirmButtonPressed.emit();
  }
}
