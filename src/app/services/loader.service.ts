import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(public loadingController: LoadingController) {}

  showLoader() {
    this.loadingController
      .create({
        message: 'Por favor espere...',
        spinner: 'crescent',
        backdropDismiss: false,
      })
      .then(res => {
        res.present();
      });
  }

  hideLoader() {
    this.loadingController
      .dismiss()
      .then(res => {
        console.log('Loading dismissed!', res);
      })
      .catch(error => {
        console.log('error', error);
      });
  }
}
