import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonSlides, ModalController, Platform } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-business-wizard',
  templateUrl: './add-business-wizard.component.html',
  styleUrls: ['./add-business-wizard.component.scss'],
})
export class AddBusinessWizardComponent implements OnInit, AfterViewInit {
  @ViewChild(IonSlides) ionSlides: IonSlides;
  slideOpts: any = {};
  businessName: string;
  businessNIF: string;
  businessAddress: any;
  businessPhoneNumber: number;
  maxTries: number;
  userId: string;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private keyboard: Keyboard,
    private alertService: AlertService,
    private platform: Platform,
    private auth: AuthService,
  ) {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    });
  }

  ngOnInit() {
    this.maxTries = 3;
  }

  async ngAfterViewInit(): Promise<void> {
    await this.ionSlides.lockSwipes(true);
  }

  async saveBusinessName(name) {
    this.businessName = name;
    await this.nextSlide();
  }

  async saveBusinessNIF(nif) {
    this.businessNIF = nif;
    await this.nextSlide();
  }

  async saveBusinessAddress(address) {
    this.businessAddress = address;
    await this.nextSlide();
  }

  async saveBusinessPhone(phone) {
    this.businessPhoneNumber = phone;
    await this.authService.sendPhoneVerificationCode(phone);
    await this.nextSlide();
  }

  async checkVerificationCode(code) {
    try {
      await this.authService.verifyPhoneNumber(code);

      await this.modalController.dismiss({
        done: true,
        values: {
          name: this.businessName,
          nif: this.businessNIF,
          address: this.businessAddress,
          phone: this.businessPhoneNumber,
          ownerId: this.userId,
        },
      });
    } catch (e) {
      this.maxTries--;
      if (this.maxTries > 0) {
        const subheader =
          (this.maxTries === 1 ? 'Queda ' : 'Quedan ') +
          this.maxTries +
          (this.maxTries === 1 ? ' intento' : ' intentos');
        await this.alertService.presentAlertWithSubheader(
          'Error',
          subheader,
          'El código de verificación es incorrecto. Por favor, introduzca de nuevo el teléfono o inténtelo de nuevo.',
        );
        await this.ionSlides.slidePrev();
      } else {
        await this.alertService.presentAlertWithSubheader(
          'Error',
          'Quedan ' + this.maxTries + ' intentos',
          'Ha agotado el número de intentos, se le va a redirigir al login',
        );
        await this.cancel();
      }
    }
  }

  async nextSlide() {
    await this.ionSlides.lockSwipeToNext(false);
    await this.ionSlides.slideNext(600);
    await this.ionSlides.lockSwipes(false);
    await this.ionSlides.lockSwipeToNext(true);

    if (this.platform.is('cordova')) {
      await this.keyboard.hide(); // For cordova, to prevent going to the nextSlide with 'enter'
    }
  }

  async cancel() {
    this.maxTries = 3;
    await this.modalController.dismiss({ done: false });
  }
}
