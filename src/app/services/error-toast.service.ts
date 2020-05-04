import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorToastService {

  constructor(private toastController: ToastController) { }

  async present(options :  {message: string, duration?: number , color?:string}){
    const toast = await this.toastController.create({
      message: options.message,
      duration: !options.duration ? 2000 : options.duration,
      color: !options.color ? 'danger' : options.color,
    });
    await toast.present();
  }
}
