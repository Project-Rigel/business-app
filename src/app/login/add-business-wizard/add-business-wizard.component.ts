import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-business-wizard',
  templateUrl: './add-business-wizard.component.html',
  styleUrls: ['./add-business-wizard.component.scss'],
})
export class AddBusinessWizardComponent {
  constructor(private modalController: ModalController) {}

  //ngOnInit() {}

  async cancel() {
    await this.modalController.dismiss({ done: false });
  }
}
