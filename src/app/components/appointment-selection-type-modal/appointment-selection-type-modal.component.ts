import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-appointment-selection-type-modal',
  templateUrl: './appointment-selection-type-modal.component.html',
  styleUrls: ['./appointment-selection-type-modal.component.scss'],
})
export class AppointmentSelectionTypeModalComponent {
  constructor(private modalController: ModalController) {}

  async typeSelected(type: string) {
    await this.modalController.dismiss({
      done: true,
      value: {
        type: type,
      },
    });
  }

  async closeCancelModal() {
    await this.modalController.dismiss({});
  }
}
