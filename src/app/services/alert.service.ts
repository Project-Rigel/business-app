import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async presentSimpleAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  async presentOkCancelAlert(
    header: string,
    message: string,
  ): Promise<Observable<boolean>> {
    const userHasAccepted = new Subject<boolean>();
    const userHasAccepted$: Observable<boolean> = userHasAccepted.asObservable();
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          handler: async () => {
            userHasAccepted.next(false);
          },
        },
        {
          text: 'Aceptar',
          handler: async () => {
            userHasAccepted.next(true);
          },
        },
      ],
    });
    await alert.present();
    return userHasAccepted$;
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
