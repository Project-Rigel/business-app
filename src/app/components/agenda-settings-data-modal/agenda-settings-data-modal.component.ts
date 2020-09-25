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
  startTime: string;
  endTime: string;
  static DAY_OF_WEEK_SEGMENT_VALUE = 'dayOfWeek';
  static SPECIFIC_DATE_SEGMENT_VALUE = 'specificDate';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.initializeValues();
  }

  segmentChanged($event: any) {
    this.segmentValue = $event.detail.value;
  }

  selectedDayOfWeek(event) {
    this.dayOfWeek = event.detail.value;
  }

  selectedStartTime(event) {
    this.startTime = event.detail.value;
  }

  selectedEndTime(event) {
    this.endTime = event.detail.value;
  }

  async closeSuccessModal() {
    await this.modalController.dismiss({
      done: true,
      value: {
        day: this.dayOfWeek,
        starTime: this.startTime,
        endTime: this.endTime,
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
    this.startTime = today.toISOString();
    today.setHours(today.getHours() + 4);
    this.endTime = today.toISOString();
  }
}
