import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ErrorToastService {
  private toast: HTMLIonToastElement;

  constructor(private toastController: ToastController) {}

  async present(options: {
    message: string;
    duration?: number;
    color?: string;
  }) {
    try {
      this.toast = await this.toastController.create({
        message: options.message,
        duration: !options.duration ? 2000 : options.duration,
        color: !options.color ? 'danger' : options.color,
      });
      await this.toast.present();
    } catch (e) {
      console.log(e);
    }
  }

  async dismiss() {
    if (this.toast) {
      await this.toastController.dismiss();
      await this.toast.onDidDismiss();
    }
  }
}
