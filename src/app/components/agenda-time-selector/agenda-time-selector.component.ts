import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-agenda-time-selector',
  templateUrl: './agenda-time-selector.component.html',
  styleUrls: ['./agenda-time-selector.component.scss'],
})
export class AgendaTimeSelectorComponent {
  @Input() isAddingAppointment: boolean;
  @Input() dateTime: Date;
  @Output() onTimeChipSelected = new EventEmitter<string>();
  @Output() onTimeChipDeselected = new EventEmitter();
  @Output() onConfirmButtonPressed = new EventEmitter();
  selectedStartTime: boolean;

  async chipSelected(event) {
    this.selectedStartTime = true;
    await this.onTimeChipSelected.emit(event.detail.value);
  }

  async chipDeselection() {
    await this.onTimeChipDeselected.emit();
  }

  async confirmButtonPressed() {
    await this.onConfirmButtonPressed.emit();
  }
}
