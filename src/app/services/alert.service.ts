import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  static AppointmentMustBeConfirmed: Subject<any> = new Subject<any>();

  constructor(private alertController: AlertController) {}

  async presentSimpleAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  async presentOkCancelAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Aceptar',
          handler: async () => {
            AlertService.AppointmentMustBeConfirmed.next(true);
          },
        },
      ],
    });
    await alert.present();
  }

  async presentAlertWithSubheader(
    header: string,
    subheader: string,
    message: string,
  ) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
}
