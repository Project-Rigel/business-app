import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(public loadingController: LoadingController) {}

  async showLoader() {
    try {
      const loader = await this.loadingController.create({
        message: 'Por favor espere...',
        spinner: 'crescent',
        backdropDismiss: false,
      });
      await loader.present();
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async hideLoader() {
    try {
      await this.loadingController.dismiss();
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
