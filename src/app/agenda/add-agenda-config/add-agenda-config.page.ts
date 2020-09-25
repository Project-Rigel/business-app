import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgendaSettingsDataModalComponent } from '../../components/agenda-settings-data-modal/agenda-settings-data-modal.component';

@Component({
  selector: 'app-add-agenda-config',
  templateUrl: './add-agenda-config.page.html',
  styleUrls: ['./add-agenda-config.page.scss'],
})
export class AddAgendaConfigPage {
  constructor(private modalController: ModalController) {}

  async showAgendaSettingsDataModal() {
    const modal = await this.modalController.create({
      component: AgendaSettingsDataModalComponent,
      cssClass: 'agenda-data-modal',
      swipeToClose: true,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data && data.done) {
      console.log(data.value);
    } else {
      console.log('not done');
    }
  }
}
