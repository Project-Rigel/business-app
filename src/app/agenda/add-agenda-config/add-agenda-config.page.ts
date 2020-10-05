import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgendaSettingsDataModalComponent } from '../../components/agenda-settings-data-modal/agenda-settings-data-modal.component';

interface Configuration {
  day: string;
  startTime: Date;
  endTime: Date;
  specificDate: Date;
}

@Component({
  selector: 'app-add-agenda-config',
  templateUrl: './add-agenda-config.page.html',
  styleUrls: ['./add-agenda-config.page.scss'],
})
export class AddAgendaConfigPage {
  englishDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  spanishDays = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  configurations: Configuration[] = [];

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
      data.value.day = this.translateDayIntoSpanish(data.value.day);
      this.configurations.push(data.value);
    } else {
      console.log('canceled');
    }
  }

  sortBy(field: string) {
    return this.configurations.sort((a, b) =>
      a[field] > b[field] ? 1 : a[field] === b[field] ? 0 : -1,
    );
  }

  translateDayIntoSpanish(day: string) {
    const dayIndex = this.englishDays.indexOf(day);
    return this.spanishDays[dayIndex];
  }
}
