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
      await this.dismiss();
    } catch (e) {}
    try {
      this.toast = await this.toastController.create({
        message: options.message,
        duration: !options.duration ? 1000 : options.duration,
        color: !options.color ? 'danger' : options.color,
      });
      await this.toast.present();
    } catch (e) {
      console.log(e);
    }
  }

  async dismiss() {
    try {
      await this.toastController.dismiss();
    } catch (e) {}
  }
}
