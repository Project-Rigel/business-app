import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agenda-settings-data-modal',
  templateUrl: './agenda-settings-data-modal.component.html',
  styleUrls: ['./agenda-settings-data-modal.component.scss'],
})
export class AgendaSettingsDataModalComponent implements OnInit {
  segmentValue: string =
    AgendaSettingsDataModalComponent.DAY_OF_WEEK_SEGMENT_VALUE;
  dayOfWeek: string;
  startTime: Date;
  endTime: Date;
  specificDate: Date;
  static DAY_OF_WEEK_SEGMENT_VALUE = 'dayOfWeek';
  static SPECIFIC_DATE_SEGMENT_VALUE = 'specificDate';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.initializeValues();
  }

  segmentChanged($event: any) {
    this.segmentValue = $event.detail.value;
    this.segmentValue ===
    AgendaSettingsDataModalComponent.SPECIFIC_DATE_SEGMENT_VALUE
      ? (this.specificDate = new Date())
      : (this.specificDate = null);
    this.segmentValue ===
    AgendaSettingsDataModalComponent.DAY_OF_WEEK_SEGMENT_VALUE
      ? (this.dayOfWeek = 'Lunes')
      : (this.dayOfWeek = null);
  }

  selectedDayOfWeek(event) {
    this.dayOfWeek = event.detail.value;
  }

  selectedStartTime(event) {
    this.startTime = new Date(event.detail.value);
  }

  selectedEndTime(event) {
    this.endTime = new Date(event.detail.value);
  }

  selectedSpecificDate(event) {
    this.specificDate = new Date(event.detail.value);
  }

  async closeSuccessModal() {
    await this.modalController.dismiss({
      done: true,
      value: {
        day: this.dayOfWeek,
        startTime: this.startTime,
        endTime: this.endTime,
        specificDate: this.specificDate,
      },
    });
  }

  async closeCancelModal() {
    await this.modalController.dismiss({});
  }

  initializeValues() {
    this.dayOfWeek = 'Monday';
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    this.startTime = today;
    today.setHours(today.getHours() + 4);
    this.endTime = today;
  }
}
